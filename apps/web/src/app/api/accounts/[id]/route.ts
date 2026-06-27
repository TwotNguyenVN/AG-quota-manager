import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: params.id },
      include: { quotaStatus: true },
    });
    if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(account);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const account = await prisma.account.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(account);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.account.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
