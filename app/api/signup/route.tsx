import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.json();
  console.log("Request body: ", formData);
  const { firstName, lastName, email, password } = formData;
  const schema = z.object({
    firstName: z
      .string()
      .regex(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
      .min(3)
      .max(30),
    lastName: z
      .string()
      .regex(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
      .min(3)
      .max(30),
    email: z.string().email(),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .min(8)
      .max(30),
  });
  try {
    schema.parse(formData);
  } catch (error) {
    console.log("Error: ", error.errors);
    return NextResponse.json({ message: error.errors }, { status: 400 });
  }
  let hashedPassword = await bcrypt.hash(password, 10);
  const existedUser = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (existedUser.rows.length > 0) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, password, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [firstName, lastName, email, hashedPassword, "/avatars/noUser.png"]
  );
  if (!result) {
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "User created successfully" },
    { status: 201 }
  );
}
