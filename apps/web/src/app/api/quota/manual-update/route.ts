import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function POST(request: Request) {
  try {
    const { accountId, quotaPercent, status, errorMessage, note } = await request.json();

    if (!accountId || quotaPercent === undefined || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use a transaction to ensure both status and history are updated
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Update status
      const updatedStatus = await tx.quotaStatus.update({
        where: { accountId },
        data: {
          quotaPercent,
          status,
          source: 'Manual',
          errorMessage,
          lastCheckedAt: new Date(),
        },
      });

      // 2. Create history log
      await tx.quotaHistory.create({
        data: {
          accountId,
          quotaPercent,
          status,
          source: 'Manual',
          errorMessage,
          note,
        },
      });

      return updatedStatus;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
