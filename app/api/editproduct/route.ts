import { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/db/index";
import fs from "fs";
import path from "path";

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

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    let body = await req.json();
    console.log(body);
    let { title, description, price, images, category, quantity, rate } =
      body.product;
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
    const result = await query(
      "UPDATE products SET title = $1, description = $2, price = $3, images = $4, category = $5, quantity = $6, rate = $7 WHERE id = $8 RETURNING *",
      [
        title,
        description,
        price,
        images,
        category,
        quantity,
        rate,
        body.product.id,
      ]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    let product = result.rows[0];
    return NextResponse.json({ message: "Product updated", product });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 }
    );
  }
}
