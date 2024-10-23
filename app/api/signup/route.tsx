import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { z } from "zod";

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.json();
  console.log("Request body: ", formData);
  const { firstName, lastName, email, password } = formData;
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });
  try {
    schema.parse(formData);
  } catch (error) {
    console.log("Error: ", error.errors[0].message);
    return NextResponse.json(
      { message: error.errors[0].message },
      { status: 400 }
    );
  }
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
    [firstName, lastName, email, password]
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
