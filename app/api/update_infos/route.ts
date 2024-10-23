import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { z } from "zod";
import { getToken } from "next-auth/jwt";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const schema = z.object({
    firstName: z.string().min(3).max(30),
    lastName: z.string().min(3).max(30),
  });
  try {
    schema.parse(body);
  } catch (error) {
    console.log("Error: ", error.errors);
    return NextResponse.json({ message: error.errors }, { status: 400 });
  }
  const { firstName, lastName } = body;
  const token = await getToken({ req, secret: process.env.SECRET });
  const uresult = await query("SELECT * FROM users WHERE email = $1", [
    token.email,
  ]);
  const user = uresult.rows[0];
  const result = await query(
    `UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING *`,
    [firstName, lastName, user.email]
  );
  if (!result) {
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "User infos updated successfully" },
    { status: 200 }
  );
}
