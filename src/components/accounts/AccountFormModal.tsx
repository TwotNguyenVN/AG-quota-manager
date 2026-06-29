"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Account = {
  id: string;
  nickname: string;
  emailHint: string;
  plan: string;
  chromeProfileName: string;
  isShared: boolean;
  isActive: boolean;
  priority: string;
  note: string;
};

type Props = {
  account: Account | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function AccountFormModal({ account, onClose, onSuccess }: Props) {
  const isEditing = !!account;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nickname: account?.nickname || "",
    emailHint: account?.emailHint || "",
    plan: account?.plan || "AI Pro",
    chromeProfileName: account?.chromeProfileName || "",
    chromeProfilePath: "", // We don't fetch this for list, keep empty unless needed
    browserType: "chrome",
    isShared: account?.isShared || false,
    isActive: account?.isActive ?? true,
    priority: account?.priority || "medium",
    note: account?.note || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const url = isEditing ? `/api/accounts/${account.id}` : "/api/accounts";
      const method = isEditing ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error?.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to save account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900/90 backdrop-blur-2xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
          <h2 className="text-xl font-semibold text-zinc-100">{isEditing ? 'Edit Account' : 'Add New Account'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 text-red-400 rounded-lg text-sm border border-red-900/30">
              {error}
            </div>
          )}
          
          <form id="account-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Nickname <span className="text-red-500">*</span></label>
                <input 
                  required
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="e.g. AG-01"
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/20 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email Hint</label>
                <input 
                  name="emailHint"
                  value={formData.emailHint}
                  onChange={handleChange}
                  placeholder="e.g. user@gmail.com"
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/20 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Chrome Profile Name <span className="text-emerald-500 text-xs">(Crucial)</span></label>
                <input 
                  name="chromeProfileName"
                  value={formData.chromeProfileName}
                  onChange={handleChange}
                  placeholder="e.g. Profile 1"
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-emerald-950/20 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
                <p className="text-xs text-zinc-500">The exact profile name shown in Chrome profile switcher.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Plan</label>
                <select 
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/20 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                >
                  <option value="AI Pro">AI Pro</option>
                  <option value="Free">Free</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Priority</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/20 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Note</label>
              <textarea 
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-zinc-200 transition-all focus:bg-black/40"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 p-4 bg-white/5 border border-white/10 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-zinc-200">Active Account</div>
                  <div className="text-zinc-500 text-xs">Enable for quota checking</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" name="isShared" checked={formData.isShared} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-zinc-200">Shared Account</div>
                  <div className="text-zinc-500 text-xs">Account is shared with others</div>
                </div>
              </label>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="account-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-emerald-100 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg transition-all flex items-center justify-center min-w-[100px] shadow-lg shadow-emerald-900/20 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
