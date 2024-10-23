import { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/db/index";
import fs from "fs";
import path from "path";
import { z } from "zod";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  category: string;
  created_at: string;
  updated_at: string;
  orders: number;
  refunds: number;
  rate: number;
};

const addProductSchema = z.object({
  title: z.string().min(3).max(40),
  description: z.string().min(100).max(500),
  price: z.number().min(1).max(100_000),
  images: z.array(z.string()).optional(),
  category: z.enum([
    "Clothes",
    "Electronics",
    "Furniture",
    "Shoes",
    "Miscellaneous",
  ]),
  quantity: z.number().min(1).max(1_000),
  rate: z.number().min(0).max(5),
});

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    let body = await req.json();
    console.log(body);
    let { title, description, price, images, category, quantity, rate } =
      body.product as Product;
    console.log(title, description, price, images, category, quantity, rate);
    try {
      addProductSchema.parse(body.product);
      NextResponse.next();
    } catch (e) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    let index = 0;
    for (let img of images) {
      let imgPath = path.join("./public", img);
      if (!fs.existsSync(imgPath)) {
        let imgExt = img.match(/^data:image\/(png|jpg|jpeg);base64,/)[1];
        let rand = Math.floor(1000000 + Math.random() * 9000000);
        let imgName = `/products/${title}_${index}_${rand}.${imgExt}`;
        let imgPath = path.join("./public", imgName);
        images[index] = imgName;
        fs.writeFileSync(
          imgPath,
          img.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          "base64"
        );
      }
      index++;
    }
    const time = new Date().toISOString();
    const result = await query(
      "UPDATE products SET title = $1, description = $2, price = $3, images = $4, category = $5, quantity = $6, rate = $7, updated_at = $8 WHERE id = $9 RETURNING *",
      [
        title,
        description,
        price,
        images,
        category,
        quantity,
        rate,
        time,
        body.product.id,
      ]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    let product = result.rows[0];
    return NextResponse.json({ message: "Product updated", product });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 }
    );
  }
}
