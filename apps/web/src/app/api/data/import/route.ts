import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function POST(request: Request) {
  try {
    const backupData = await request.json();

    if (!backupData || !backupData.data) {
      return NextResponse.json({ error: 'Invalid backup format' }, { status: 400 });
    }

    const { accounts, quotaHistory, settings } = backupData.data;

    // Validate that these arrays exist
    if (!Array.isArray(accounts) || !Array.isArray(quotaHistory) || !Array.isArray(settings)) {
      return NextResponse.json({ error: 'Missing data arrays in backup' }, { status: 400 });
    }

    // We execute wipe and replace in a single transaction
    await prisma.$transaction(async (tx: any) => {
      // 1. Wipe current data
      // Due to onDelete: Cascade, deleting Accounts will also delete QuotaStatus and QuotaHistory
      // However, we'll explicitly delete all just to be safe and clean.
      await tx.quotaHistory.deleteMany();
      await tx.quotaStatus.deleteMany();
      await tx.account.deleteMany();
      await tx.setting.deleteMany();

      // 2. Insert Settings
      if (settings.length > 0) {
        await tx.setting.createMany({
          data: settings.map((s: any) => ({
            id: s.id,
            key: s.key,
            value: s.value,
            updatedAt: s.updatedAt ? new Date(s.updatedAt) : new Date(),
          }))
        });
      }

      // 3. Insert Accounts & QuotaStatus
      // createMany doesn't support nested writes (like inserting QuotaStatus with Account)
      // So we iterate and create each account
      for (const account of accounts) {
        const { quotaStatus, ...accountData } = account;
        
        await tx.account.create({
          data: {
            id: accountData.id,
            nickname: accountData.nickname,
            emailHint: accountData.emailHint,
            plan: accountData.plan,
            chromeProfileName: accountData.chromeProfileName,
            chromeProfilePath: accountData.chromeProfilePath,
            isShared: accountData.isShared,
            sharedWith: accountData.sharedWith,
            priority: accountData.priority,
            isActive: accountData.isActive,
            note: accountData.note,
            createdAt: accountData.createdAt ? new Date(accountData.createdAt) : new Date(),
            updatedAt: accountData.updatedAt ? new Date(accountData.updatedAt) : new Date(),
            // Create QuotaStatus if it exists
            ...(quotaStatus ? {
              quotaStatus: {
                create: {
                  id: quotaStatus.id,
                  quotaPercent: quotaStatus.quotaPercent,
                  status: quotaStatus.status,
                  resetEstimate: quotaStatus.resetEstimate ? new Date(quotaStatus.resetEstimate) : null,
                  lastCheckedAt: quotaStatus.lastCheckedAt ? new Date(quotaStatus.lastCheckedAt) : new Date(),
                  source: quotaStatus.source,
                  errorMessage: quotaStatus.errorMessage,
                  createdAt: quotaStatus.createdAt ? new Date(quotaStatus.createdAt) : new Date(),
                  updatedAt: quotaStatus.updatedAt ? new Date(quotaStatus.updatedAt) : new Date(),
                }
              }
            } : {})
          }
        });
      }

      // 4. Insert QuotaHistory
      if (quotaHistory.length > 0) {
        await tx.quotaHistory.createMany({
          data: quotaHistory.map((h: any) => ({
            id: h.id,
            accountId: h.accountId,
            quotaPercent: h.quotaPercent,
            status: h.status,
            resetEstimate: h.resetEstimate ? new Date(h.resetEstimate) : null,
            source: h.source,
            checkedAt: h.checkedAt ? new Date(h.checkedAt) : new Date(),
            errorMessage: h.errorMessage,
            note: h.note,
            createdAt: h.createdAt ? new Date(h.createdAt) : new Date(),
          }))
        });
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Backup imported successfully',
      stats: {
        accounts: accounts.length,
        history: quotaHistory.length,
        settings: settings.length
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
