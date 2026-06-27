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

    // 1. Loại bỏ các account không đạt điều kiện (Red, Locked, Unknown)
    const validAccounts = activeAccounts.filter((acc: any) => {
      const status = acc.quotaStatus?.status;
      return status !== 'Red' && status !== 'Locked' && status !== 'Unknown';
    });

    if (validAccounts.length === 0) {
      return NextResponse.json({ message: 'No valid accounts available', recommendation: null });
    }

    const now = new Date();

    // Hàm tính toán freshness score (càng nhỏ càng fresh)
    const getFreshnessScore = (lastCheckedAt?: Date) => {
      if (!lastCheckedAt) return 4; // Very stale
      const diffMins = (now.getTime() - new Date(lastCheckedAt).getTime()) / 1000 / 60;
      if (diffMins < 10) return 1; // Fresh
      if (diffMins < 30) return 2; // Maybe old
      if (diffMins < 120) return 3; // Stale
      return 4; // Very stale
    };

    // Sắp xếp
    const sorted = validAccounts.sort((a: any, b: any) => {
      const aFreshness = getFreshnessScore(a.quotaStatus?.lastCheckedAt);
      const bFreshness = getFreshnessScore(b.quotaStatus?.lastCheckedAt);

      // Rule 1: Ưu tiên dữ liệu Fresh
      if (aFreshness !== bFreshness) return aFreshness - bFreshness;

      const aQuota = a.quotaStatus?.quotaPercent ?? 0;
      const bQuota = b.quotaStatus?.quotaPercent ?? 0;

      // Rule 2: Ưu tiên Quota cao (Green > Yellow)
      if (aQuota > 50 && bQuota <= 50) return -1;
      if (aQuota <= 50 && bQuota > 50) return 1;

      // Rule 3: Ưu tiên không share
      if (!a.isShared && b.isShared) return -1;
      if (a.isShared && !b.isShared) return 1;

      // Rule 4: Priority cao hơn
      if (a.priority !== b.priority) return b.priority - a.priority;

      // Rule 5: Quota phần trăm cao hơn
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
