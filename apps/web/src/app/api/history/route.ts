import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const timeRange = searchParams.get('timeRange'); // today, 7days, 30days
    const source = searchParams.get('source'); // Manual, Mock
    const errorOnly = searchParams.get('errorOnly') === 'true';

    const where: any = {};
    if (accountId) where.accountId = accountId;
    if (source) where.source = source;
    if (errorOnly) where.errorMessage = { not: null };

    if (timeRange) {
      const now = new Date();
      if (timeRange === 'today') {
        now.setHours(0, 0, 0, 0);
        where.checkedAt = { gte: now };
      } else if (timeRange === '7days') {
        now.setDate(now.getDate() - 7);
        where.checkedAt = { gte: now };
      } else if (timeRange === '30days') {
        now.setDate(now.getDate() - 30);
        where.checkedAt = { gte: now };
      }
    }

    const history = await prisma.quotaHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        account: {
          select: { nickname: true }
        }
      }
    });

    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
