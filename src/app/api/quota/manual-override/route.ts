import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountId, quotaPercent, status, resetEstimate, note } = body;

    if (!accountId) {
      return errorResponse("Missing accountId", "INVALID_REQUEST", 400);
    }

    const quotaStatus = await prisma.quotaStatus.upsert({
      where: { accountId },
      update: {
        quotaPercent,
        status,
        resetEstimate,
        lastCheckedAt: new Date(),
        source: "manual-override",
        errorCode: null,
        errorMessage: null
      },
      create: {
        accountId,
        quotaPercent,
        status,
        resetEstimate,
        lastCheckedAt: new Date(),
        source: "manual-override"
      }
    });

    await prisma.quotaHistory.create({
      data: {
        accountId,
        quotaPercent,
        status,
        resetEstimate,
        source: "manual-override",
        checkedAt: new Date(),
        note
      }
    });

    return successResponse({ result: quotaStatus });
  } catch (error: any) {
    return errorResponse("Manual override failed", "DB_ERROR", 500);
  }
}
