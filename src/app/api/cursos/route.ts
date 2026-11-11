import { NextResponse } from "next/server";
import { COURSES } from "@/lib/data";

export async function GET() {
  return NextResponse.json(COURSES.filter((c) => c.active));
}

