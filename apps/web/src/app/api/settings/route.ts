import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    // Convert array of objects to a key-value map
    const settingsMap = settings.reduce((acc: Record<string, string>, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    return NextResponse.json(settingsMap);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data: Record<string, string> = await request.json();
    
    // Upsert each setting
    const operations = Object.entries(data).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
