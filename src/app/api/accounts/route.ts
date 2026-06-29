import { NextRequest } from "next/server";
import prisma from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      include: { quotaStatus: true },
      orderBy: { createdAt: "desc" }
    });
    return successResponse({ accounts });
  } catch (error: any) {
    return errorResponse("Failed to fetch accounts", "DB_ERROR", 500, { details: error.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const account = await prisma.account.create({
      data: {
        nickname: body.nickname,
        emailHint: body.emailHint,
        plan: body.plan || "AI Pro",
        chromeProfileName: body.chromeProfileName,
        chromeProfilePath: body.chromeProfilePath,
        browserType: body.browserType || "chrome",
        isShared: body.isShared || false,
        sharedWith: body.sharedWith,
        priority: body.priority || "medium",
        isActive: body.isActive ?? true,
        note: body.note
      }
    });
    return successResponse({ account }, 201);
  } catch (error: any) {
    return errorResponse("Failed to create account", "DB_ERROR", 500, { details: error.message });
  }
}
