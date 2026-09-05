import { NextResponse } from "next/server";
import { intakeLead } from "@/lib/lead-intake";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = await intakeLead(request, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  if (result.ignored) {
    return NextResponse.json({ reference: result.reference });
  }

  return NextResponse.json({
    reference: result.lead.reference,
    duplicate: result.duplicate,
    synthetic: result.lead.is_synthetic,
  });
}
