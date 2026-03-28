'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface AdminStats {
  totalUsers: number;
  totalNegotiations: number;
  totalStudsCirculating: number;
  yields: number[];
  adminName: string;
  adminEmail: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (!data.error) setStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats");
    }
  };

  const fetchUserRegistry = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!data.error) setUsers(data);
    } catch (err) {
      console.error("Failed to fetch user registry");
    }
  };

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (session?.user?.email !== 'admin@bricknegotiate') {
      router.push('/dashboard');
    } else {
      Promise.all([fetchAdminStats(), fetchUserRegistry()]).finally(() => setLoading(false));
    }
  }, [session, status, router]);

  if (loading || session?.user?.email !== 'admin@bricknegotiate') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="font-headline font-black text-4xl animate-pulse uppercase tracking-widest text-on-background/20">
          verifying command clearance...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <div className="flex pt-20 flex-1">
        {/* Admin Sidebar */}
        <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] flex flex-col z-40 bg-[#F0EDEC] dark:bg-[#1A1A1A] w-64 border-r-4 border-[#111111] font-body font-semibold text-sm uppercase tracking-wider">
          <div className="p-6 flex items-center gap-3 border-b-2 border-[#111111]">
            <div className="w-10 h-10 bg-primary border-2 border-on-background rounded-full flex items-center justify-center overflow-hidden">
               <span className="material-symbols-outlined text-white">shield_person</span>
            </div>
            <div>
              <div className="text-[#111111] dark:text-[#FCF9F8] font-extrabold truncate w-32">{stats?.adminName}</div>
              <div className="text-[10px] opacity-60">System Administrator</div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <Link className="flex items-center gap-3 text-[#111111] dark:text-[#FCF9F8] p-4 hover:bg-primary-container/20 transition-colors" href="/dashboard">
              <span className="material-symbols-outlined">home</span> Dashboard
            </Link>
            <Link className="flex items-center gap-3 text-[#111111] dark:text-[#FCF9F8] p-4 hover:bg-primary-container/20 transition-colors" href="/game">
              <span className="material-symbols-outlined">play_arrow</span> Marketplace
            </Link>
            <Link className="bg-[#F4C542] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] m-2 rounded-lg flex items-center gap-3 p-4 active:scale-98" href="/admin">
              <span className="material-symbols-outlined">analytics</span> Command Center
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 bg-surface">
          <header className="mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-black text-on-background tracking-tighter mb-2 uppercase">Command Center</h1>
            <p className="font-body text-on-surface-variant font-medium">Monitoring the Brick Exchange Protocol.</p>
          </header>

          {/* Metrics Bento */}
          <div className="grid grid-cols-12 gap-8 mb-12">
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border-4 border-on-background rounded-2xl p-8 brick-shadow">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <span className="font-headline text-xs font-bold uppercase tracking-widest text-[#111111] mb-1 block opacity-40">Negotiation Efficiency</span>
                  <h2 className="font-headline text-2xl font-black uppercase">Market Yields (Recent Deals)</h2>
                </div>
              </div>
              
              <div className="h-48 flex items-end gap-3 w-full border-b-2 border-on-background/10">
                {stats?.yields.map((y, i) => (
                    <div 
                        key={i} 
                        style={{ height: `${Math.min(100, (y / 1500) * 100)}%` }}
                        className={`flex-1 ${i % 2 === 0 ? 'bg-primary' : 'bg-secondary'} border-2 border-on-background rounded-t-lg transition-all hover:opacity-80 relative group`}
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-background text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            ${y.toFixed(0)}
                        </div>
                    </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-black opacity-30 uppercase tracking-widest">
                <span>Recent History</span>
                <span>Real-time Data Stream</span>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="bg-primary-container border-4 border-on-background p-6 rounded-2xl flex items-center justify-between brick-shadow">
                <div>
                  <div className="font-headline text-[10px] font-black uppercase opacity-60 mb-1">Total Users</div>
                  <div className="text-4xl font-black font-headline tracking-tighter">{stats?.totalUsers}</div>
                </div>
                <span className="material-symbols-outlined text-5xl">group</span>
              </div>
              
              <div className="bg-secondary-container border-4 border-on-background p-6 rounded-2xl flex items-center justify-between brick-shadow">
                <div>
                  <div className="font-headline text-[10px] font-black uppercase opacity-60 mb-1">Negotiations</div>
                  <div className="text-4xl font-black font-headline tracking-tighter">{stats?.totalNegotiations}</div>
                </div>
                <span className="material-symbols-outlined text-5xl">handshake</span>
              </div>

              <div className="bg-tertiary-container border-4 border-on-background p-6 rounded-2xl flex items-center justify-between brick-shadow">
                <div>
                  <div className="font-headline text-[10px] font-black uppercase opacity-60 mb-1">Studs Traded</div>
                  <div className="text-4xl font-black font-headline tracking-tighter">
                    {stats?.totalStudsCirculating && stats.totalStudsCirculating > 1000 ? `${(stats.totalStudsCirculating / 1000).toFixed(1)}k` : stats?.totalStudsCirculating}
                  </div>
                </div>
                <span className="material-symbols-outlined text-5xl">database</span>
              </div>
            </div>
          </div>

          {/* User Registry Table */}
          <section className="mb-12">
            <h2 className="font-headline text-3xl font-black uppercase mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl">list_alt</span> USER REGISTRY
            </h2>
            <div className="bg-white border-4 border-on-background rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead className="bg-[#111111] text-white font-headline text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Player</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Studs</th>
                    <th className="px-6 py-4">Best Deal</th>
                    <th className="px-6 py-4">Inventory</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-on-background/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-variant/5 transition-colors">
                      <td className="px-6 py-4 font-black">{u.name}</td>
                      <td className="px-6 py-4 opacity-70 group relative">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-yellow-400 border-2 border-[#111111] rounded text-xs font-black">
                          {u.studs} S
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-primary">{u.bestPrice}</td>
                      <td className="px-6 py-4 font-bold">{u.inventoryCount} items</td>
                      <td className="px-6 py-4 text-xs font-medium opacity-50">{u.joinedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="p-12 text-center text-on-surface-variant font-bold uppercase tracking-widest opacity-20">
                  No players captured in registry
                </div>
              )}
            </div>
          </section>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border-4 border-on-background p-8 rounded-2xl brick-shadow-sm group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-not-allowed">
              <h3 className="font-headline font-black text-xl mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined">edit_square</span> CATALOG CONTROL
              </h3>
              <p className="text-sm font-medium opacity-60">Manage modular parts, update market values, and configure item rarity across the catalog.</p>
            </div>
            <div className="bg-white border-4 border-on-background p-8 rounded-2xl brick-shadow-sm group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-not-allowed">
              <h3 className="font-headline font-black text-xl mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined">psychology</span> AI CORE SETTINGS
              </h3>
              <p className="text-sm font-medium opacity-60">Fine-tune merchant negotiation heuristics, patience thresholds, and settlement logic.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
