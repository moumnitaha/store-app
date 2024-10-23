import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { query } from "@/lib/db/index";

export async function GET() {
  const session = await getServerSession(OPTIONS);
  if (!session) {
    return NextResponse.json({
      status: 401,
      data: { message: "Unauthorized" },
    });
  } else if (session) {
    // console.log(session.token);
    // console.log(session);
    let result = await query("SELECT * FROM users WHERE email = $1", [
      session.token.email,
    ]);
    if (result.rows.length === 0) {
      return NextResponse.json({
        status: 401,
        data: { message: "Unauthorized" },
      });
    }
    let user = result.rows[0];
    console.log(user);
    return NextResponse.json({
      status: 200,
      data: {
        message: "Authorized",
        name: user.first_name + " " + user.last_name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  }
}
