import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { z } from "zod";
import path from "path";
import fs from "fs";

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
  rates: z.number().min(0).max(5),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { title, description, price, images, category, quantity, rates } =
      body.product;
    try {
      addProductSchema.parse(body.product);
      NextResponse.next();
    } catch (e) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    images = images.filter((image: string) => image !== "");
    let index = 0;
    for (let img of images) {
      let imgExt = img.match(/^data:image\/(png|jpg|jpeg);base64,/)[1];
      let rand = Math.floor(1000000 + Math.random() * 9000000);
      let imgName = `/products/${title}_${index}_${rand}.${imgExt}`;
      let imgPath = path.join("./public", imgName);
      fs.writeFileSync(
        imgPath,
        img.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      images[index] = imgName;
      index++;
    }
    const result = await query(
      "INSERT INTO products (title, description, price, images, category, quantity, rate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, description, price, images, category, quantity, rates]
    );
    return NextResponse.json({
      message: "Product received",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error parsing body", error);
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 }
    );
  }
}
