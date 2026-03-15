import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await sql`DELETE FROM document_chunks`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
