import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reader, onlyActive } = body;
    
    // TODO: Implement actual refresh all logic here (Phase 7)
    // Skeleton implementation
    
    return successResponse({
      summary: {
        total: 0,
        successCount: 0,
        errorCount: 0,
        skippedCount: 0,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        durationMs: 0
      },
      results: []
    });
  } catch (error: any) {
    return errorResponse("Refresh all failed", "UNKNOWN_ERROR", 500);
  }
}
