import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get("accountId");
    const source = searchParams.get("source");
    const status = searchParams.get("status");
    
    const where: any = {};
    if (accountId) where.accountId = accountId;
    if (source) where.source = source;
    if (status) where.status = status;

    const history = await prisma.quotaHistory.findMany({
      where,
      orderBy: { checkedAt: "desc" },
      take: 100 // limit for now
    });
    
    return successResponse({ history });
  } catch (error: any) {
    return errorResponse("Failed to fetch history", "DB_ERROR", 500);
  }
}
