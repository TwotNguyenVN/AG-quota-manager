import { AccountList } from "@/components/accounts/AccountList";

export default function AccountsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Accounts & Profiles</h1>
        <p className="text-zinc-500 mt-2">
          Map your Google accounts to specific Chrome Profiles for Quota Reader to work correctly.
        </p>
      </div>
      
      <AccountList />
    </div>
  );
}
