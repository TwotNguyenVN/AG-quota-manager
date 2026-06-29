import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ accountId: string }> }) {
  try {
    const { accountId } = await params;
    const history = await prisma.quotaHistory.findMany({
      where: { accountId },
      orderBy: { checkedAt: "desc" },
      take: 50
    });
    
    return successResponse({ history });
  } catch (error: any) {
    return errorResponse("Failed to fetch history for account", "DB_ERROR", 500);
  }
}
