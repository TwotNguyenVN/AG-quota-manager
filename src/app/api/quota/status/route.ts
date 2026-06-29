import { successResponse, errorResponse } from "@/lib/api-response";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const items = await prisma.quotaStatus.findMany({
      include: { account: true }
    });
    return successResponse({ items });
  } catch (error: any) {
    return errorResponse("Failed to fetch quota statuses", "DB_ERROR", 500);
  }
}
