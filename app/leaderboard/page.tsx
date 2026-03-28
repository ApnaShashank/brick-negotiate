'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  price: number;
  rounds: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (Array.isArray(data)) {
          setEntries(data);
        }
      } catch (err) {
        console.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const validEntries = entries.filter(e => e.price < 999999);
  const topThree = validEntries.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <div className="flex pt-20">
        <Sidebar />

        <main className="lg:ml-64 p-6 md:p-12 w-full">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-background uppercase mb-2">Hall of Fame</h1>
            <p className="text-on-surface-variant font-body font-semibold italic">Ranked by the lowest deal price achieved for the Skyline Modular Tower.</p>
          </header>

          {loading ? (
            <div className="text-center py-20">
              <div className="font-headline font-black text-4xl animate-pulse text-on-background/20 uppercase tracking-widest">establishing rankings...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20 bg-surface-container border-4 border-on-background rounded-xl italic text-on-surface-variant opacity-60">
              No verified deals recorded yet. Be the first to build a legacy!
            </div>
          ) : (
            <div className="space-y-16">
              {/* Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end max-w-5xl mx-auto">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="order-2 md:order-1 transform hover:-translate-y-2 transition-all">
                    <div className="relative bg-secondary-container border-4 border-on-background rounded-xl p-6 brick-shadow text-center">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-secondary border-4 border-on-background rounded-full flex items-center justify-center text-white font-headline text-xl">2</div>
                      <h3 className="text-lg font-black uppercase truncate px-2 mb-3">{topThree[1].name}</h3>
                      <div className="bg-on-background text-secondary-container px-4 py-1 rounded-full text-xs font-black inline-block">${topThree[1].price.toFixed(2)}</div>
                    </div>
                  </div>
                )}
                {/* 1st Place */}
                {topThree[0] && (
                  <div className="order-1 md:order-2 transform hover:-translate-y-4 transition-all z-10">
                    <div className="relative bg-primary-container border-4 border-on-background rounded-2xl p-8 brick-shadow-lg text-center scale-110">
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-primary border-4 border-on-background rounded-full flex items-center justify-center text-white font-headline text-4xl shadow-xl">1</div>
                      <h3 className="text-xl font-black uppercase truncate mb-4">{topThree[0].name}</h3>
                      <div className="bg-on-background text-primary-container px-6 py-2 rounded-full text-xl font-black inline-block">${topThree[0].price.toFixed(2)}</div>
                    </div>
                  </div>
                )}
                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="order-3 transform hover:-translate-y-2 transition-all">
                    <div className="relative bg-tertiary-container border-4 border-on-background rounded-xl p-6 brick-shadow text-center">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-tertiary border-4 border-on-background rounded-full flex items-center justify-center text-white font-headline text-xl">3</div>
                      <h3 className="text-lg font-black uppercase truncate px-2 mb-3">{topThree[2].name}</h3>
                      <div className="bg-on-background text-tertiary-container px-4 py-1 rounded-full text-xs font-black inline-block">${topThree[2].price.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Table */}
              <section className="max-w-5xl mx-auto pb-12">
                <div className="bg-surface-container border-4 border-on-background rounded-2xl overflow-hidden brick-shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-on-background text-white uppercase font-headline">
                          <th className="p-6 text-xs tracking-widest">Rank</th>
                          <th className="p-6 text-xs tracking-widest">Negotiator</th>
                          <th className="p-6 text-xs tracking-widest">Rounds</th>
                          <th className="p-6 text-xs tracking-widest text-right">Price Achieved</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry, idx) => {
                          const isCurrentUser = session?.user?.email === entry.email;
                          return (
                            <tr key={entry.id} className={`border-b-2 border-on-background transition-colors ${isCurrentUser ? 'bg-primary-container/40' : 'hover:bg-surface-container-high'}`}>
                              <td className="p-6 text-xl md:text-2xl font-black opacity-30">{(idx + 1).toString().padStart(2, '0')}</td>
                              <td className="p-6">
                                <span className={`font-bold uppercase ${isCurrentUser ? 'text-primary animate-pulse' : 'text-on-surface'}`}>
                                  {entry.name} {isCurrentUser && '(YOU)'}
                                </span>
                              </td>
                              <td className="p-6">
                                <span className="bg-on-background/5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">{entry.rounds} ROUNDS</span>
                              </td>
                              <td className="p-6 text-right font-black text-lg md:text-xl">
                                {entry.price < 999999 ? `$${entry.price.toFixed(2)}` : <span className="text-sm opacity-40 uppercase tracking-widest italic">No Deals Yet</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
