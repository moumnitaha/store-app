import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { query } from "@/lib/db/index";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("Token: ", token);
  try {
    const response = await query("SELECT * FROM users WHERE id = $1", [
      token.id,
    ]);
    console.log(response);
    if (response.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    let imgExt = body.img.match(/^data:image\/(png|jpg|jpeg);base64,/)[1];
    let imgName = `/avatars/${btoa(token.email)}.${imgExt}`;
    let imgPath = path.join("./public", imgName);
    fs.writeFileSync(
      imgPath,
      body.img.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    const result = await query(
      "UPDATE users SET avatar = $1 WHERE id = $2 RETURNING *",
      [imgName, token.id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Failed to update avatar" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Avatar updated" });
  } catch (error) {
    console.error("Error parsing body", error);
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 }
    );
  }
}
