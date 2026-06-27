import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function GET() {
  try {
    const activeAccounts = await prisma.account.findMany({
      where: { isActive: true },
      include: { quotaStatus: true },
    });

    if (activeAccounts.length === 0) {
      return NextResponse.json({ message: 'No active accounts available', recommendation: null });
    }

    // 1. Quota > 50%
    // 2. Không share (isShared === false) ưu tiên hơn
    // 3. Priority cao ưu tiên hơn
    const sorted = activeAccounts.sort((a, b) => {
      const aQuota = a.quotaStatus?.quotaPercent ?? 0;
      const bQuota = b.quotaStatus?.quotaPercent ?? 0;

      // Rule 1: Ưu tiên Quota cao (Green)
      if (aQuota > 50 && bQuota <= 50) return -1;
      if (aQuota <= 50 && bQuota > 50) return 1;

      // Rule 2: Ưu tiên không share
      if (!a.isShared && b.isShared) return -1;
      if (a.isShared && !b.isShared) return 1;

      // Rule 3: Priority cao hơn
      if (a.priority !== b.priority) return b.priority - a.priority;

      // Rule 4: Quota phần trăm cao hơn
      return bQuota - aQuota;
    });

    const recommended = sorted[0];

    return NextResponse.json({
      recommendation: recommended
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
