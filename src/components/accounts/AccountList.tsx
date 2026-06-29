"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, RotateCw, Play, Copy, Terminal, FolderOpen } from "lucide-react";
import { AccountFormModal } from "./AccountFormModal";

type QuotaStatus = "green" | "yellow" | "red" | "locked" | "unknown" | "error";

interface Account {
  id: string;
  nickname: string;
  emailHint: string | null;
  plan: string;
  chromeProfileName: string | null;
  isActive: boolean;
  isShared: boolean;
  quotaStatus?: {
    quotaPercent?: number;
    status: QuotaStatus;
    resetEstimate?: string;
  };
}

export function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(undefined);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/accounts");
      if (!res.ok) throw new Error("Failed to fetch accounts");
      const data = await res.json();
      setAccounts(data.accounts);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const openNew = () => {
    setSelectedAccount(undefined);
    setIsModalOpen(true);
  };

  const openEdit = (account: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");
      fetchAccounts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-zinc-400">Loading accounts...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Accounts</h1>
          <p className="text-sm text-[#64748b] mt-1">Manage all your Google accounts and AI quotas</p>
        </div>
        <button 
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Plus className="h-4 w-4" />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          // Dummy data for visual representation if real quota doesn't exist yet
          const progress = acc.quotaStatus?.quotaPercent || 75;
          const isError = !acc.isActive; // Simulate error state if inactive

          return (
            <div key={acc.id} className="bg-[#151b2b] border border-[#2a3041] rounded-2xl overflow-hidden flex flex-col shadow-lg">
              
              {/* Header */}
              <div className="p-5 pb-3">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm bg-[#334155] border border-[#475569]"></div>
                    <span className="font-semibold text-zinc-200 text-sm">{acc.emailHint || acc.nickname}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {isError ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7f1d1d] text-red-200 border border-red-900/50">401</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#14532d] text-green-300 border border-green-900/50">PRO</span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-black">PLUS</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 text-[11px]">
                  <span className="text-[#64748b]">Team Name: Tài khoản cá nhân</span>
                  <span className="bg-[#1e293b] text-[#94a3b8] px-2 py-1 rounded">Trong dịch vụ API</span>
                  <span className="bg-[#1e293b] text-[#94a3b8] px-2 py-1 rounded flex items-center gap-1"><Plus className="w-3 h-3"/> Thêm</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e293b] text-[#94a3b8] text-xs font-medium hover:bg-[#334155] transition-colors border border-[#2a3041]">
                    <RotateCw className="w-3 h-3" />
                    Lượt đặt lại 0
                  </button>
                </div>
                
                <div className="text-[11px] text-[#64748b] mb-4">
                  Đã đăng nhập bằng Password | ID người dùng: {acc.id.substring(0, 8)}...
                </div>
              </div>

              {/* Error Box (Conditional) */}
              {isError && (
                <div className="mx-5 mb-4 p-4 rounded-xl border border-[#7f1d1d] bg-[#450a0a]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <p className="text-[11px] text-red-200/80 leading-relaxed max-w-[200px]">
                    Ủy quyền đăng nhập đã bị thu hồi và không thể tự động làm mới. Hãy đăng nhập lại.
                  </p>
                  <button className="whitespace-nowrap px-4 py-2 bg-white text-black text-xs font-medium rounded-lg hover:bg-zinc-200 transition-colors">
                    Ủy quyền OAuth
                  </button>
                </div>
              )}

              {/* Progress Bars */}
              <div className="px-5 pb-5 space-y-4 border-b border-[#2a3041]">
                {/* Bar 1 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <div className="flex items-center gap-1.5 text-[#94a3b8]">
                      <Activity className="w-3.5 h-3.5" /> 5h
                    </div>
                    <span className={isError ? "text-red-500 font-medium" : "text-emerald-500 font-medium"}>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end text-[10px] text-[#64748b] mt-1.5">
                    4h 6m (06/27 19:24)
                  </div>
                </div>

                {/* Bar 2 (only if not error for variety) */}
                {!isError && (
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1.5">
                      <div className="flex items-center gap-1.5 text-[#94a3b8]">
                        <Activity className="w-3.5 h-3.5" /> Weekly
                      </div>
                      <span className="text-orange-500 font-medium">39%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '39%' }}></div>
                    </div>
                    <div className="flex justify-end text-[10px] text-[#64748b] mt-1.5">
                      4d 1h 59m (07/01 17:18)
                    </div>
                  </div>
                )}
                
                {/* Expiry Box */}
                <div className="flex justify-between items-center px-3 py-2 bg-[#064e3b]/20 border border-[#065f46]/30 rounded-lg text-[11px]">
                  <span className="text-emerald-500 font-medium">Hết hạn gói 27 ngày</span>
                  <span className="text-[#94a3b8]">2026-07-23 19:57</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-3 bg-[#0f111a]/50 flex items-center justify-between mt-auto">
                <span className="text-[11px] text-[#64748b]">26/06/2026 16:49</span>
                
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 text-[#64748b] hover:text-white hover:bg-[#1e293b] rounded-md transition-colors"><FolderOpen className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 text-[#64748b] hover:text-white hover:bg-[#1e293b] rounded-md transition-colors"><Terminal className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 text-[#64748b] hover:text-white hover:bg-[#1e293b] rounded-md transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 text-[#64748b] hover:text-white hover:bg-[#1e293b] rounded-md transition-colors"><Play className="w-3.5 h-3.5" /></button>
                  <button onClick={() => openEdit(acc)} className="p-1.5 text-[#64748b] hover:text-emerald-400 hover:bg-[#1e293b] rounded-md transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(acc.id)} className="p-1.5 text-[#64748b] hover:text-red-400 hover:bg-[#1e293b] rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <AccountFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchAccounts}
          account={selectedAccount}
        />
      )}
    </div>
  );
}
