import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.json(); // Parse JSON from the request body
  console.log("Request body: ", formData);
  return NextResponse.json(
    { message: "User created successfully" },
    { status: 201 }
  );
}
