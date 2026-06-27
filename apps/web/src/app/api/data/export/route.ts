import { NextResponse } from 'next/server';
import { prisma } from 'database';
export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        quotaStatus: true,
      },
    });
    
    const quotaHistory = await prisma.quotaHistory.findMany();
    const settings = await prisma.setting.findMany();

    const exportData = {
      app_version: process.env.npm_package_version || '1.0.0',
      exported_at: new Date().toISOString(),
      data: {
        accounts,
        quotaHistory,
        settings,
      },
    };

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="ag-quota-manager-backup-${new Date().toISOString().split('T')[0]}.json"`,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
