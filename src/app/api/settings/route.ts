import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    // Convert array of {key, value} to an object { [key]: value }
    const settingsObj = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    return successResponse({ settings: settingsObj });
  } catch (error: any) {
    return errorResponse("Failed to fetch settings", "DB_ERROR", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json(); // Expected: { key: value, key2: value2 }
    
    // Process sequentially or in a transaction
    const updatePromises = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });

    await Promise.all(updatePromises);
    
    return successResponse({ updated: true });
  } catch (error: any) {
    return errorResponse("Failed to update settings", "DB_ERROR", 500);
  }
}
