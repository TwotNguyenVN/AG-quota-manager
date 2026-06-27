import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where = accountId ? { accountId } : {};

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
