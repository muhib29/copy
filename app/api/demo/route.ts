import { NextResponse } from "next/server";
import type { DemoResponse } from "@shared/api";

export async function GET() {
  const response: DemoResponse = { message: "Hello from Express server" };
  return NextResponse.json(response, { status: 200 });
}
