// import { db, schema } from "@/utils/db.js";
// import { eq } from "drizzle-orm";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const userEmail = searchParams.get("email"); // pass ?email=xyz@example.com

//   if (!userEmail) {
//     return new Response(JSON.stringify({ error: "Email required" }), {
//       status: 400,
//     });
//   }

//   try {
//     const interviews = await db
//       .select({
//         id: schema.MockInterview.id,
//         date: schema.MockInterview.createdAt,
//         role: schema.MockInterview.jsonPosition,
//         score: schema.UserAnswer.rating,
//       })
//       .from(schema.MockInterview)
//       .leftJoin(
//         schema.UserAnswer,
//         eq(schema.MockInterview.mockId, schema.UserAnswer.mockIdRef)
//       )
//       .where(eq(schema.MockInterview.createdBy, userEmail));

//     return new Response(JSON.stringify(interviews), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
//       status: 500,
//     });
//   }
// }

// import { NextResponse } from "next/server";
// import { neon } from "@neondatabase/serverless";

// const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);

// export async function GET() {
//   try {
//     const result = await sql`SELECT COUNT(*) FROM interviews;`;
//     const count = result[0].count;
//     return NextResponse.json({ count });
//   } catch (error) {
//     console.error("Error fetching interview count:", error);
//     return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
//   }
// }
// app/api/interviews/route.js
import { db, schema } from "@/utils/db";
import { eq } from "drizzle-orm";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("email");

  if (!userEmail) {
    return new Response(JSON.stringify({ error: "Email required" }), {
      status: 400,
    });
  }

  try {
    const interviews = await db
      .select({
        id: schema.MockInterview.id,
        date: schema.MockInterview.createdAt,
        role: schema.MockInterview.jsonPosition,
        score: schema.UserAnswer.rating,
      })
      .from(schema.MockInterview)
      .leftJoin(
        schema.UserAnswer,
        eq(schema.MockInterview.mockId, schema.UserAnswer.mockIdRef)
      )
      .where(eq(schema.MockInterview.createdBy, userEmail));

    return new Response(JSON.stringify(interviews), { status: 200 });
  } catch (error) {
    console.error("Error fetching interview history:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}


