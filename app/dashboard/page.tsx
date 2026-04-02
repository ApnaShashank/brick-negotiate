'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/game-data';
import OnboardingGuide from '@/components/OnboardingGuide';
import DailyRewardModal from '@/components/DailyRewardModal';
import NotificationManager from '@/components/NotificationManager';

interface UserStats {
  bestPrice: number;
  totalGames: number;
  totalDeals: number;
  totalFailed: number;
  winRate: number;
  studs: number;
  inventory: any[];
  name?: string;
  hasSeenGuide?: boolean;
  streak: number;
  recentNegotiations: {
    productName: string;
    seller: string;
    price: number;
    status: string;
    rounds: number;
    date: string;
  }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }

    if (session) {
      async function fetchStats() {
        try {
          const res = await fetch('/api/user/stats');
          const data = await res.json();
          if (data && !data.error) {
            setStats(data);
            const locallyOnboarded = localStorage.getItem('brick_negotiate_onboarded');
            if (data.hasSeenGuide === false && !locallyOnboarded) {
              setShowGuide(true);
            }
          }
        } catch (err) {
          console.error("Failed to load dashboard stats");
        } finally {
          setLoading(false);
        }
      }
      fetchStats();
    }
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <div className="flex pt-20">
          <Sidebar />
          <main className="lg:ml-64 p-6 md:p-12 w-full space-y-12 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="w-72 h-12 bg-on-surface-variant/20 rounded-xl mb-3"></div>
                <div className="w-40 h-4 bg-on-surface-variant/10 rounded-md"></div>
              </div>
              <div className="w-48 h-24 bg-on-surface-variant/20 border-4 border-transparent rounded-2xl"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="h-32 bg-on-surface-variant/10 border-4 border-transparent rounded-xl"></div>
               ))}
            </div>
            <div>
              <div className="w-64 h-8 bg-on-surface-variant/20 rounded-xl mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="h-64 bg-on-surface-variant/10 border-4 border-transparent rounded-2xl"></div>
                 ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <NotificationManager />
      <DailyRewardModal />

      {showGuide && (
        <OnboardingGuide onComplete={() => setShowGuide(false)} />
      )}

      <div className="flex pt-20">
        <Sidebar />

        <main className="lg:ml-64 p-6 md:p-12 w-full space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-headline font-black uppercase tracking-tighter">Collector's Office</h1>
              <p className="text-on-surface-variant font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Status: Master Architect</p>
            </div>
            <div className="flex items-center gap-4">
              {stats?.streak && stats.streak > 0 ? (
                <div className="bg-orange-300 border-4 border-on-background px-4 py-2 rounded-2xl brick-shadow flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">local_fire_department</span>
                  <div className="font-headline font-black text-lg">{stats.streak} 🔥</div>
                </div>
              ) : null}
              <div className="bg-primary-container border-4 border-on-background px-8 py-4 rounded-2xl brick-shadow flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">token</span>
                <div>
                  <div className="text-[10px] font-black uppercase opacity-60">Stud Balance</div>
                  <div className="text-3xl font-headline font-black">{stats?.studs?.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-surface-container border-4 border-on-background p-5 rounded-xl brick-shadow">
              <div className="text-[10px] font-black uppercase opacity-40 mb-2">Total Games</div>
              <div className="text-2xl font-headline font-black">{stats?.totalGames || 0}</div>
            </div>
            <div className="bg-green-200 border-4 border-on-background p-5 rounded-xl brick-shadow">
              <div className="text-[10px] font-black uppercase opacity-40 mb-2">Deals Won ✅</div>
              <div className="text-2xl font-headline font-black">{stats?.totalDeals || 0}</div>
            </div>
            <div className="bg-red-200 border-4 border-on-background p-5 rounded-xl brick-shadow">
              <div className="text-[10px] font-black uppercase opacity-40 mb-2">Deals Failed ❌</div>
              <div className="text-2xl font-headline font-black">{stats?.totalFailed || 0}</div>
            </div>
            <div className="bg-blue-200 border-4 border-on-background p-5 rounded-xl brick-shadow">
              <div className="text-[10px] font-black uppercase opacity-40 mb-2">Win Rate</div>
              <div className="text-2xl font-headline font-black">{stats?.winRate || 0}%</div>
            </div>
            <div className="bg-surface-container border-4 border-on-background p-5 rounded-xl brick-shadow">
              <div className="text-[10px] font-black uppercase opacity-40 mb-2">Best Price</div>
              <div className="text-2xl font-headline font-black">${stats?.bestPrice === 999999 ? '0' : stats?.bestPrice?.toFixed(0)}</div>
            </div>
            <Link href="/game" className="bg-on-background text-surface p-5 rounded-xl brick-shadow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group">
              <span className="font-headline font-black uppercase text-lg">New Trade</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          {/* Recent Activity */}
          {stats?.recentNegotiations && stats.recentNegotiations.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-black uppercase mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined">history</span> Recent Activity
              </h2>
              <div className="bg-white border-4 border-on-background rounded-2xl overflow-hidden brick-shadow overflow-x-auto">
                <table className="w-full text-left font-body">
                  <thead className="bg-[#111111] text-white font-headline text-xs uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Seller</th>
                      <th className="px-6 py-4">Rounds</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-on-background/5">
                    {stats.recentNegotiations.map((neg, idx) => (
                      <tr key={idx} className="hover:bg-surface-variant/5 transition-colors">
                        <td className="px-6 py-4 font-black uppercase text-sm">{neg.productName}</td>
                        <td className="px-6 py-4 font-bold text-sm opacity-70">{neg.seller}</td>
                        <td className="px-6 py-4">
                          <span className="bg-on-background/5 px-3 py-1 rounded-md text-[10px] font-black uppercase">{neg.rounds} Rounds</span>
                        </td>
                        <td className="px-6 py-4 font-black text-lg">${neg.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-black uppercase rounded border ${
                            neg.status === 'accepted' ? 'bg-green-200 border-green-500 text-green-800' : 'bg-red-200 border-red-500 text-red-800'
                          }`}>
                            {neg.status === 'accepted' ? '✅ Deal' : '❌ Failed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium opacity-50">{neg.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Display Case (Inventory) */}
          <section>
            <h2 className="text-2xl font-headline font-black uppercase mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined">shelves</span> The Display Case
            </h2>
            {stats?.inventory && stats.inventory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {stats.inventory.map((item, idx) => {
                  const product = PRODUCTS.find(p => p.id === item.productId);
                  return (
                    <div key={idx} className="bg-white border-4 border-on-background rounded-2xl overflow-hidden brick-shadow hover:-translate-y-2 transition-transform group">
                      <div className="aspect-video relative overflow-hidden bg-surface-container">
                        <img src={product?.image} alt={product?.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                        <div className="absolute top-2 right-2 bg-on-background text-surface px-2 py-1 text-[10px] font-black rounded uppercase">
                          ${item.purchasePrice.toFixed(0)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-headline font-black uppercase text-lg truncate">{product?.name || item.productName || item.productId}</h3>
                        <div className="text-[10px] font-bold opacity-40 uppercase mt-1">
                          Acquired: {new Date(item.acquiredAt).toLocaleDateString()}
                          {item.sellerPersonality && ` | Seller: ${item.sellerPersonality}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-surface-container border-4 border-dashed border-on-background/20 p-20 rounded-3xl text-center">
                <span className="material-symbols-outlined text-6xl opacity-20">package_2</span>
                <p className="mt-4 font-headline uppercase font-black opacity-30">Your shelves are empty. Start negotiating!</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
