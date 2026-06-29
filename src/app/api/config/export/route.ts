import { successResponse, errorResponse } from "@/lib/api-response";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const accounts = await prisma.account.findMany();
    const settings = await prisma.setting.findMany();
    
    return successResponse({
      config: {
        accounts,
        settings,
        exportedAt: new Date().toISOString(),
        version: "0.1.0"
      }
    });
  } catch (error: any) {
    return errorResponse("Failed to export config", "DB_ERROR", 500);
  }
}
