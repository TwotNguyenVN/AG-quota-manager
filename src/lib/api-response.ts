import { NextResponse } from "next/server";

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function errorResponse(message: string, code = "UNKNOWN_ERROR", status = 400, additionalData = {}) {
  return NextResponse.json({ success: false, error: { code, message, ...additionalData } }, { status });
}
