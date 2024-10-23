import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const schema = z.object({
    newPassword: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .min(8)
      .max(30),
  });
  try {
    schema.parse(body);
  } catch (error) {
    console.log("Error: ", error.errors);
    return NextResponse.json({ message: error.errors }, { status: 400 });
  }
  const { oldPassword, newPassword } = body;
  const token = await getToken({ req, secret: process.env.SECRET });
  const uresult = await query("SELECT * FROM users WHERE email = $1", [
    token.email,
  ]);
  const user = uresult.rows[0];
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Old password is not correct" },
      { status: 400 }
    );
  }
  let hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await query(
    `UPDATE users SET password = $1 WHERE email = $2 RETURNING *`,
    [hashedPassword, user.email]
  );
  if (!result) {
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "Password updated successfully" },
    { status: 200 }
  );
}
