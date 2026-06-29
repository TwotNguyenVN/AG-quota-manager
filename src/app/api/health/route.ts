import { successResponse } from "@/lib/api-response";

export async function GET() {
  return successResponse({
    status: "ok",
    app: "AG Quota Manager",
    version: "0.1.0",
    timestamp: new Date().toISOString()
  });
}
