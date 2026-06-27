import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function GET() {
  try {
    const statuses = await prisma.quotaStatus.findMany({
      include: {
        account: {
          select: { id: true, nickname: true, plan: true, isShared: true }
        }
      },
    });
    return NextResponse.json(statuses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
