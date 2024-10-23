import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { query } from "@/lib/db/index";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    let imgIndex = body.image;
    let product = body.product;
    if (imgIndex !== null) {
      let imgPath = path.join("./public", product.images[imgIndex]);
      fs.unlinkSync(imgPath);
      //update product images
      product.images.splice(imgIndex, 1);
      //update product in db
      const result = await query(
        "UPDATE products SET images = $1 WHERE id = $2 RETURNING *",
        [product.images, product.id]
      );
      return NextResponse.json({
        message: "Image deleted successfully",
      });
    }
    //delete product
    const result = await query("DELETE FROM products WHERE id = $1", [
      product.id,
    ]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    } else {
      try {
        for (let img of product.images) {
          let imgPath = path.join("./public", img);
          fs.unlinkSync(imgPath);
        }
      } catch (error) {
        console.error("!! Error deleting images");
        //   return NextResponse.json(
        // 	{ error: "Failed to delete product images" },
        // 	{ status: 500 }
        //   );
      }
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error parsing body", error);
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 }
    );
  }
}
