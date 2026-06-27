import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      include: { quotaStatus: true },
      orderBy: { priority: 'desc' },
    });
    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const account = await prisma.account.create({
      data: {
        ...data,
        quotaStatus: {
          create: {
            quotaPercent: 100,
            status: 'Green',
            source: 'Manual',
          }
        }
      },
    });
    return NextResponse.json(account, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
