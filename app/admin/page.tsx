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
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'catalog' | 'feedback'>('overview');
  
  // Spy Modal
  const [spyUserId, setSpyUserId] = useState<string | null>(null);
  const [spyLogs, setSpyLogs] = useState<any[]>([]);
  const [spyLoading, setSpyLoading] = useState(false);
  
  // Grant Studs Modal
  const [grantUserId, setGrantUserId] = useState<string | null>(null);
  const [grantAmount, setGrantAmount] = useState('500');
  
  // Catalog
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', marketValue: '', hardMinimum: '', image: '', difficulty: 'Medium' });

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (!data.error) setStats(data);
    } catch (err) { console.error("Failed to fetch admin stats"); }
  };

  const fetchUserRegistry = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!data.error) setUsers(data);
    } catch (err) { console.error("Failed to fetch user registry"); }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (!data.error) setFeedbacks(data);
    } catch (err) { console.error("Failed to fetch feedback"); }
  };

  const fetchCatalog = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (!data.error) setCatalogProducts(data);
    } catch (err) { console.error("Failed to fetch catalog"); }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') { router.push('/auth'); return; }
    if (session?.user?.email !== 'admin@bricknegotiate') { router.push('/dashboard'); return; }
    
    Promise.all([fetchAdminStats(), fetchUserRegistry(), fetchFeedback(), fetchCatalog()])
      .finally(() => setLoading(false));
  }, [session, status, router]);

  // Spy: fetch chat logs
  const openSpyLogs = async (userId: string) => {
    setSpyUserId(userId);
    setSpyLoading(true);
    try {
      const res = await fetch(`/api/admin/chat-logs?userId=${userId}`);
      const data = await res.json();
      setSpyLogs(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Spy failed"); }
    finally { setSpyLoading(false); }
  };

  // God Mode: Grant studs
  const handleGrantStuds = async () => {
    if (!grantUserId || !grantAmount) return;
    try {
      const res = await fetch('/api/admin/grant-studs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: grantUserId, amount: Number(grantAmount) })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.message}`);
        setGrantUserId(null);
        fetchUserRegistry();
      }
    } catch (err) { alert("Failed to grant studs"); }
  };

  // God Mode: Ban/Unban
  const handleBanToggle = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/ban-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.message}`);
        fetchUserRegistry();
      }
    } catch (err) { alert("Failed to toggle ban"); }
  };

  // Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.marketValue || !newProduct.hardMinimum) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          marketValue: Number(newProduct.marketValue),
          hardMinimum: Number(newProduct.hardMinimum)
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddProduct(false);
        setNewProduct({ name: '', description: '', marketValue: '', hardMinimum: '', image: '', difficulty: 'Medium' });
        fetchCatalog();
      }
    } catch (err) { alert("Failed to add product"); }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' });
      fetchCatalog();
    } catch (err) { alert("Failed to delete"); }
  };

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
        <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] flex flex-col z-40 bg-[#F0EDEC] w-64 border-r-4 border-[#111111] font-body font-semibold text-sm uppercase tracking-wider">
          <div className="p-6 flex items-center gap-3 border-b-2 border-[#111111]">
            <div className="w-10 h-10 bg-primary border-2 border-on-background rounded-full flex items-center justify-center overflow-hidden">
               <span className="material-symbols-outlined text-white">shield_person</span>
            </div>
            <div>
              <div className="text-[#111111] font-extrabold truncate w-32">{stats?.adminName}</div>
              <div className="text-[10px] opacity-60">System Administrator</div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            {[
              { id: 'overview', icon: 'analytics', label: 'Overview' },
              { id: 'users', icon: 'group', label: 'User Registry' },
              { id: 'catalog', icon: 'edit_square', label: 'Catalog Control' },
              { id: 'feedback', icon: 'notification_important', label: 'Feedback' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 p-4 transition-colors ${activeTab === tab.id ? 'bg-[#F4C542] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] m-2 rounded-lg' : 'text-[#111111] hover:bg-primary-container/20'}`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span> {tab.label}
              </button>
            ))}
            <hr className="my-4 border-[#111111]/10" />
            <Link className="flex items-center gap-3 text-[#111111] p-4 hover:bg-primary-container/20 transition-colors" href="/dashboard">
              <span className="material-symbols-outlined">home</span> Dashboard
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 bg-surface">
          <header className="mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-black text-on-background tracking-tighter mb-2 uppercase">Command Center</h1>
            <p className="font-body text-on-surface-variant font-medium">Monitoring the Brick Exchange Protocol.</p>
          </header>

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div>
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
                      <div key={i} style={{ height: `${Math.min(100, (y / 1500) * 100)}%` }}
                        className={`flex-1 ${i % 2 === 0 ? 'bg-primary' : 'bg-secondary'} border-2 border-on-background rounded-t-lg transition-all hover:opacity-80 relative group`}>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-background text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">${y.toFixed(0)}</div>
                      </div>
                    ))}
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
            </div>
          )}

          {/* Tab: Users */}
          {activeTab === 'users' && (
            <section>
              <h2 className="font-headline text-3xl font-black uppercase mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl">list_alt</span> USER REGISTRY
              </h2>
              <div className="bg-white border-4 border-on-background rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] overflow-x-auto">
                <table className="w-full text-left font-body">
                  <thead className="bg-[#111111] text-white font-headline text-xs uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-4">Player</th>
                      <th className="px-4 py-4">Email</th>
                      <th className="px-4 py-4">Studs</th>
                      <th className="px-4 py-4">Logins</th>
                      <th className="px-4 py-4">Streak</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Inventory</th>
                      <th className="px-4 py-4">Joined</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-on-background/5">
                    {users.map((u) => {
                      const isNew = u.joinedAt && (Date.now() - new Date(u.rawJoinedAt || u.joinedAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
                      return (
                        <tr key={u.id} className={`hover:bg-surface-variant/5 transition-colors ${u.isBanned ? 'opacity-40 bg-red-50' : ''}`}>
                          <td className="px-4 py-3 font-black">{u.name}</td>
                          <td className="px-4 py-3 opacity-70 text-xs">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-yellow-400 border-2 border-[#111111] rounded text-xs font-black">{u.studs} S</span>
                          </td>
                          <td className="px-4 py-3 font-bold text-sm">{u.loginCount || 0}</td>
                          <td className="px-4 py-3 font-bold text-sm">{u.streak || 0} 🔥</td>
                          <td className="px-4 py-3">
                            {u.isBanned ? (
                              <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded">Banned</span>
                            ) : isNew ? (
                              <span className="px-2 py-1 bg-green-400 text-[10px] font-black uppercase rounded border border-[#111]">New</span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-300 text-[10px] font-black uppercase rounded border border-[#111]">Active</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-bold text-sm">{u.inventoryCount} items</td>
                          <td className="px-4 py-3 text-xs font-medium opacity-50">{u.joinedAt}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => openSpyLogs(u.id)} className="p-1.5 bg-blue-100 border border-blue-400 rounded hover:bg-blue-200 transition-colors" title="Spy Chat Logs">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                              </button>
                              <button onClick={() => setGrantUserId(u.id)} className="p-1.5 bg-yellow-100 border border-yellow-500 rounded hover:bg-yellow-200 transition-colors" title="Grant Studs">
                                <span className="material-symbols-outlined text-sm">payments</span>
                              </button>
                              <button onClick={() => handleBanToggle(u.id)} className={`p-1.5 ${u.isBanned ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-400'} border rounded hover:opacity-80 transition-colors`} title={u.isBanned ? 'Unban' : 'Ban'}>
                                <span className="material-symbols-outlined text-sm">{u.isBanned ? 'lock_open' : 'block'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="p-12 text-center text-on-surface-variant font-bold uppercase tracking-widest opacity-20">No players captured in registry</div>
                )}
              </div>
            </section>
          )}

          {/* Tab: Catalog */}
          {activeTab === 'catalog' && (
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline text-3xl font-black uppercase flex items-center gap-3">
                  <span className="material-symbols-outlined text-4xl">edit_square</span> CATALOG CONTROL
                </h2>
                <button onClick={() => setShowAddProduct(true)} className="bg-primary-container border-4 border-on-background px-6 py-3 rounded-xl font-headline font-black uppercase brick-shadow hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">add</span> Add Product
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <div className="bg-white border-4 border-on-background rounded-2xl p-8 brick-shadow mb-8">
                  <h3 className="font-headline font-black uppercase mb-6">New Product</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Product Name" className="p-3 border-2 border-on-background rounded-xl font-bold" />
                    <input value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="Image URL" className="p-3 border-2 border-on-background rounded-xl font-bold" />
                    <input value={newProduct.marketValue} onChange={e => setNewProduct({...newProduct, marketValue: e.target.value})} placeholder="Market Value ($)" type="number" className="p-3 border-2 border-on-background rounded-xl font-bold" />
                    <input value={newProduct.hardMinimum} onChange={e => setNewProduct({...newProduct, hardMinimum: e.target.value})} placeholder="Hard Minimum ($)" type="number" className="p-3 border-2 border-on-background rounded-xl font-bold" />
                    <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Description" className="p-3 border-2 border-on-background rounded-xl font-bold md:col-span-2" rows={2} />
                    <select value={newProduct.difficulty} onChange={e => setNewProduct({...newProduct, difficulty: e.target.value})} className="p-3 border-2 border-on-background rounded-xl font-bold">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button onClick={handleAddProduct} className="bg-on-background text-surface px-8 py-3 rounded-xl font-headline font-black uppercase brick-shadow active:scale-95 transition-all">
                      Save Product
                    </button>
                    <button onClick={() => setShowAddProduct(false)} className="px-8 py-3 border-2 border-on-background rounded-xl font-bold uppercase opacity-60">Cancel</button>
                  </div>
                </div>
              )}

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogProducts.map((p: any) => (
                  <div key={p._id} className={`bg-white border-4 border-on-background rounded-2xl overflow-hidden brick-shadow ${!p.isActive ? 'opacity-40' : ''}`}>
                    {p.image && <img src={p.image} alt={p.name} className="w-full aspect-video object-cover border-b-2 border-on-background" />}
                    <div className="p-4">
                      <h3 className="font-headline font-black uppercase text-lg">{p.name}</h3>
                      <p className="text-xs opacity-60 mt-1">{p.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <span className="text-[10px] font-black opacity-40">MW:</span> <span className="font-black">${p.marketValue}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black opacity-40">MIN:</span> <span className="font-black">${p.hardMinimum}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border border-on-background ${p.difficulty === 'Easy' ? 'bg-green-300' : p.difficulty === 'Medium' ? 'bg-yellow-300' : 'bg-red-300'}`}>{p.difficulty}</span>
                      </div>
                      <button onClick={() => handleDeleteProduct(p._id)} className="mt-4 w-full py-2 bg-red-100 border-2 border-red-400 rounded-lg font-bold text-xs uppercase text-red-600 hover:bg-red-200 transition-colors">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tab: Feedback */}
          {activeTab === 'feedback' && (
            <section>
              <h2 className="font-headline text-3xl font-black uppercase mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl">notification_important</span> LATEST TRANSMISSIONS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbacks.map((f: any) => (
                  <div key={f._id} className="bg-white border-4 border-on-background p-6 rounded-2xl brick-shadow-sm flex flex-col hover:-rotate-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-1 border-2 border-[#111111] text-[10px] font-black uppercase tracking-widest ${
                        f.type === 'bug' ? 'bg-error text-white' : 
                        f.type === 'praise' ? 'bg-primary' : 
                        f.type === 'suggestion' ? 'bg-secondary' : 'bg-surface-variant'
                      }`}>{f.type}</span>
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className="material-symbols-outlined text-sm">{s <= f.rating ? 'star' : 'star_outline'}</span>
                        ))}
                      </div>
                    </div>
                    <p className="font-body font-bold text-sm mb-6 flex-1 italic">"{f.message}"</p>
                    <div className="pt-4 border-t-2 border-on-background/10 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-on-background flex items-center justify-center font-black text-xs uppercase">{f.name?.[0] || '?'}</div>
                      <div>
                        <div className="text-[10px] font-black uppercase">{f.name}</div>
                        <div className="text-[8px] opacity-40">{new Date(f.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {feedbacks.length === 0 && (
                  <div className="col-span-full py-12 text-center border-4 border-dashed border-on-background/20 rounded-2xl font-headline font-black uppercase opacity-20">No transmissions received</div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Spy Modal */}
      {spyUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSpyUserId(null)}>
          <div className="bg-white border-4 border-on-background rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto brick-shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#111] text-white p-6 flex justify-between items-center">
              <h3 className="font-headline font-black uppercase flex items-center gap-2">
                <span className="material-symbols-outlined">visibility</span> Spy: Chat Logs
              </h3>
              <button onClick={() => setSpyUserId(null)} className="text-white/60 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {spyLoading ? (
                <div className="text-center py-12 animate-pulse font-headline font-black uppercase opacity-20">Loading intercepts...</div>
              ) : spyLogs.length === 0 ? (
                <div className="text-center py-12 font-bold opacity-40">No negotiation records found for this user.</div>
              ) : (
                spyLogs.map((neg: any) => (
                  <div key={neg._id} className="border-2 border-on-background/20 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-headline font-black uppercase text-sm">{neg.productName}</span>
                      <span className={`px-2 py-1 text-[10px] font-black uppercase rounded border ${neg.status === 'accepted' ? 'bg-green-200 border-green-500' : 'bg-red-200 border-red-500'}`}>{neg.status}</span>
                    </div>
                    <div className="text-xs font-bold opacity-60 mb-3">Seller: {neg.personalityName || neg.personality} | Rounds: {neg.rounds} | Final: ${neg.finalPrice}</div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {neg.history?.map((msg: any, i: number) => (
                        <div key={i} className={`text-xs p-2 rounded ${msg.speaker === 'ai' ? 'bg-primary-container/30' : 'bg-secondary-container/30'}`}>
                          <span className="font-black uppercase text-[10px]">{msg.speaker === 'ai' ? '🤖 Merchant' : '👤 Player'}:</span> {msg.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grant Studs Modal */}
      {grantUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setGrantUserId(null)}>
          <div className="bg-white border-4 border-on-background rounded-2xl p-8 max-w-sm w-full brick-shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline font-black uppercase text-xl mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">payments</span> Grant Studs
            </h3>
            <input
              value={grantAmount}
              onChange={e => setGrantAmount(e.target.value)}
              type="number"
              className="w-full p-4 border-2 border-on-background rounded-xl font-headline font-black text-2xl text-center mb-6"
              placeholder="Amount"
            />
            <div className="flex gap-3">
              <button onClick={handleGrantStuds} className="flex-1 bg-on-background text-surface py-3 rounded-xl font-headline font-black uppercase active:scale-95 transition-all">Send</button>
              <button onClick={() => setGrantUserId(null)} className="flex-1 border-2 border-on-background py-3 rounded-xl font-bold uppercase opacity-60">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
