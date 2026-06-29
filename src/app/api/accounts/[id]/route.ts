import { NextRequest } from "next/server";
import prisma from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const account = await prisma.account.findUnique({
      where: { id },
      include: { quotaStatus: true }
    });
    if (!account) return errorResponse("Account not found", "NOT_FOUND", 404);
    return successResponse({ account });
  } catch (error: any) {
    return errorResponse("Failed to fetch account", "DB_ERROR", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const account = await prisma.account.update({
      where: { id },
      data: { ...body }
    });
    return successResponse({ account });
  } catch (error: any) {
    return errorResponse("Failed to update account", "DB_ERROR", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.account.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error: any) {
    return errorResponse("Failed to delete account", "DB_ERROR", 500);
  }
}
