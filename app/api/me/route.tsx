import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(OPTIONS);
  if (!session) {
    return NextResponse.json({
      status: 401,
      data: { message: "Unauthorized" },
    });
  } else if (session) {
    console.log(session.token);
    console.log(session);
    return NextResponse.json({
      status: 200,
      data: {
        message: "Authorized",
        name: session.token.name,
        email: session.token.email,
        avatar: session.token.image,
      },
    });
  }
}
