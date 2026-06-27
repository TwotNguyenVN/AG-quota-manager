import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function GET() {
  try {
    const settingsList = await prisma.setting.findMany();
    
    // Convert array of {key, value} to an object { key: value }
    const settingsObject = settingsList.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    return NextResponse.json(settingsObject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json(); // Expected format: { key1: "value1", key2: "value2" }
    
    // We cannot use $transaction with upsert inside a map directly without awaiting them all
    const promises = Object.entries(updates).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });
    
    await prisma.$transaction(promises);
    
    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
