'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { PRODUCTS, PERSONALITIES } from '@/lib/game-data';

const TypedChat = () => {
    const [sellerText, setSellerText] = useState('');
    const [playerText, setPlayerText] = useState('');
    const [showPlayer, setShowPlayer] = useState(false);

    const sellerFull = "Seller: My final offer is 1,200 bricks.";
    const playerFull = "Player: I can do 950 with cash studs.";

    useEffect(() => {
        let isCancelled = false;
        
        const animate = async () => {
            while (!isCancelled) {
                // Reset
                setSellerText('');
                setPlayerText('');
                setShowPlayer(false);
                await new Promise(r => setTimeout(r, 1000));

                // Type Seller
                for (let i = 0; i <= sellerFull.length; i++) {
                    if (isCancelled) return;
                    setSellerText(sellerFull.slice(0, i));
                    await new Promise(r => setTimeout(r, 40));
                }

                await new Promise(r => setTimeout(r, 1000));
                setShowPlayer(true);

                // Type Player
                for (let i = 0; i <= playerFull.length; i++) {
                    if (isCancelled) return;
                    setPlayerText(playerFull.slice(0, i));
                    await new Promise(r => setTimeout(r, 40));
                }

                await new Promise(r => setTimeout(r, 4000)); // Wait 4s before loop
            }
        };

        animate();
        return () => { isCancelled = true; };
    }, []);

    return (
        <div className="space-y-4 font-body min-h-[140px]">
            <div className={`bg-surface-container-lowest p-3 border-2 border-on-background rounded-lg rounded-bl-none max-w-[85%] transition-all duration-300 ${sellerText ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-sm font-bold">{sellerText}<span className="animate-pulse">|</span></p>
            </div>
            {showPlayer && (
                <div className={`bg-primary-container p-3 border-2 border-on-background rounded-lg rounded-br-none max-w-[85%] ml-auto transition-all duration-300 ${playerText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <p className="text-sm font-bold text-on-primary-container">{playerText}<span className="animate-pulse">|</span></p>
                </div>
            )}
        </div>
    );
};

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-start justify-between px-8 md:px-20 pt-8 md:pt-12 pb-24 gap-12 bg-surface min-h-[calc(100vh-80px)]">
          <div className="md:w-1/2 space-y-8 md:mt-10">
            <div className="inline-block bg-secondary-container border-2 border-on-background px-4 py-1 rounded-full font-label text-sm font-bold uppercase tracking-widest text-on-secondary-container">
              New Season: The Urban Build
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-extrabold text-on-background leading-none tracking-tighter">
              {session ? `Ready, ${session.user?.name?.split(' ')[0]}?` : 'Master the Art of'} <span className="text-primary-container" style={{ textShadow: '4px 4px 0 #111111' }}>{session ? 'Build' : 'Negotiation'}</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-lg font-medium leading-relaxed font-body">
              Build your deal block by block. Compete against advanced AI sellers in the ultimate high-stakes modular marketplace.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href={session ? "/game" : "/auth"}
                className="px-8 py-4 bg-primary-container border-4 border-on-background text-on-background font-headline text-xl font-extrabold brick-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:scale-95 transition-all"
              >
                {session ? 'Continue Deal' : 'Start Playing'}
              </Link>
              <Link href="/leaderboard" className="px-8 py-4 bg-surface-container-lowest border-4 border-on-background text-on-background font-headline text-xl font-extrabold hover:bg-surface-variant transition-colors flex items-center justify-center">
                View Rankings
              </Link>
            </div>
          </div>

          {/* Interactive Brick Grid Illustration */}
          <div className="md:w-1/2 w-full aspect-square relative grid grid-cols-4 grid-rows-4 gap-4 p-4 bg-surface-container border-4 border-on-background rounded-xl brick-shadow-lg stud-pattern">
            {/* Box 1 (Large Square) */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="col-span-2 row-span-2 bg-primary-container border-4 border-on-background rounded-xl flex items-center justify-center brick-shadow cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-8xl text-on-primary-container drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
            </motion.div>
            
            {/* Box 2 (Horizontal Rectangle) */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="col-span-2 bg-secondary-container border-4 border-on-background rounded-xl brick-shadow cursor-pointer flex items-center justify-center select-none"
            >
              <span className="material-symbols-outlined text-6xl text-on-secondary-container drop-shadow-md">handshake</span>
            </motion.div>
            
            {/* Box 3 (Vertical Rectangle) */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="row-span-2 bg-tertiary-container border-4 border-on-background rounded-xl brick-shadow cursor-pointer flex items-center justify-center select-none"
            >
              <span className="material-symbols-outlined text-6xl text-on-tertiary-container drop-shadow-md">psychology</span>
            </motion.div>
            
            {/* Box 4 (Small Square Top Right) */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.8, borderRadius: "50%", rotate: 90 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-surface-container-highest border-4 border-on-background rounded-xl brick-shadow flex items-center justify-center cursor-pointer select-none overflow-hidden group"
            >
              <span className="material-symbols-outlined text-5xl drop-shadow-sm group-hover:scale-125 transition-transform text-on-background">bolt</span>
            </motion.div>
            
            {/* Box 5 (Horizontal Rectangle Bottom) */}
            <motion.div 
              whileHover={{ scale: 1.02, rotateX: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="col-span-2 bg-on-background rounded-xl flex items-center justify-center cursor-pointer brick-shadow border-4 border-[#111111] select-none text-surface"
            >
              <div className="flex flex-col items-center">
                <span className="font-black text-4xl leading-none">100%</span>
                <span className="font-bold text-[10px] uppercase tracking-widest opacity-60 mt-1">Modular</span>
              </div>
            </motion.div>
            
            {/* Box 6 (Small Square Bottom Right) */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9, rotate: -15 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="bg-primary-container border-4 border-on-background rounded-xl brick-shadow flex items-center justify-center cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-5xl text-on-primary-container drop-shadow-sm">diamond</span>
            </motion.div>
          </div>

        </section>

        {/* Features Bento Grid */}
        <section className="px-8 md:px-20 py-32 bg-surface-container-low">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background mb-4 uppercase tracking-tighter">Engineered for Victory</h2>
            <div className="w-24 h-4 bg-primary-container mx-auto border-2 border-on-background"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 bg-surface-container-lowest border-4 border-on-background p-8 rounded-xl brick-shadow hover:translate-y-[-4px] transition-transform">
              <div className="w-16 h-16 bg-primary-container border-2 border-on-background rounded-lg mb-6 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <h3 className="text-2xl font-headline font-extrabold mb-4">AI-Powered Seller</h3>
              <p className="text-on-surface-variant font-medium font-body">Challenge neural networks trained on thousands of successful enterprise negotiations.</p>
            </div>

            <div className="md:col-span-8 bg-[#1E6F9F] text-white border-4 border-on-background p-8 rounded-xl brick-shadow overflow-hidden relative group">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-4xl font-headline font-extrabold mb-4 uppercase tracking-tighter">Multi-Round Endurance</h3>
                  <p className="text-secondary-fixed max-w-md text-lg font-medium font-body">It's not just a sprint. Build rapport, pivot strategies, and close the deal over multiple intense sessions.</p>
                </div>
                <div className="mt-8 flex gap-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full border-2 border-white flex items-center justify-center font-bold">1</div>
                  <div className="w-12 h-12 bg-white/20 rounded-full border-2 border-white flex items-center justify-center font-bold">2</div>
                  <div className="w-12 h-12 bg-primary-container text-on-background rounded-full border-2 border-on-background flex items-center justify-center font-bold">3</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 bg-[#E63946] text-white border-4 border-on-background p-8 rounded-xl brick-shadow relative">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-3xl font-headline font-extrabold mb-4">Leaderboard Elite</h3>
                  <p className="text-tertiary-fixed text-lg font-medium font-body">Climb the ranks and earn the title of 'Grand Architect'. Global competition resets weekly.</p>
                </div>
                <span className="material-symbols-outlined text-6xl">leaderboard</span>
              </div>
            </div>

            <div className="md:col-span-5 bg-surface-container-high border-4 border-on-background p-6 rounded-xl brick-shadow flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="ml-auto text-xs font-label font-bold uppercase tracking-widest opacity-50">Live Strategy</span>
              </div>
              <TypedChat />
            </div>
          </div>
        </section>

        {/* Meet the Dealers Section */}
        <section className="px-8 md:px-20 py-24 bg-surface">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter leading-none mb-4">Meet the Dealers</h2>
              <p className="text-lg font-bold opacity-60">High-stakes AI merchants with unique negotiation traits. Can you crack their code?</p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-on-background/10 mx-12"></div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Section 03 // Personnel</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PERSONALITIES.map((per) => (
              <div key={per.id} className="group bg-white border-4 border-on-background p-8 rounded-2xl brick-shadow hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-on-background text-surface rounded-full flex items-center justify-center mb-6 border-4 border-primary-container">
                    <span className="material-symbols-outlined text-3xl">face</span>
                </div>
                <h3 className="text-2xl font-headline font-black uppercase mb-2">{per.name}</h3>
                <p className="text-xs font-bold uppercase text-primary mb-4">{per.label}</p>
                <div className="h-0.5 w-12 bg-on-background mb-4 opacity-20"></div>
                <p className="text-sm font-medium leading-relaxed opacity-70">{per.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Vault (Marketplace Preview) Section */}
        <section className="px-8 md:px-20 py-24 bg-surface-container-low border-y-4 border-on-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full stud-pattern opacity-5 pointer-events-none"></div>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-7xl font-headline font-black uppercase tracking-tighter leading-none mb-4">The Vault</h2>
            <p className="text-lg font-bold opacity-60">Hand-curated modular sets currently active in the exchange.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="flex flex-col gap-6">
                <div className="aspect-square bg-white border-4 border-on-background rounded-3xl overflow-hidden brick-shadow relative group">
                  <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={p.name} />
                  <div className="absolute top-4 left-4 bg-primary-container border-2 border-on-background px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    ${p.marketValue} Value
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-headline font-black uppercase truncate">{p.name}</h3>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">{p.difficulty} Complexity</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Conversion Bar */}
        <section className="py-20 px-8 md:px-20">
          <div className="bg-on-background text-surface p-8 md:p-12 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 brick-shadow-lg group">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-headline font-black uppercase tracking-tighter mb-2">Build Your Inventory</h2>
              <p className="font-bold opacity-60">Negotiate, earn studs, and own the modular world.</p>
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
              <Link 
                href={session ? "/game" : "/auth"}
                className="flex-1 lg:flex-none text-center px-12 py-5 bg-primary-container text-on-background font-headline text-xl font-black uppercase border-4 border-on-background brick-shadow hover:translate-y-[-4px] active:scale-95 transition-all"
              >
                {session ? 'Enter Exchange' : 'Create Profile'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-12 flex flex-col md:flex-row justify-between items-center mt-auto bg-surface-container-high border-t-4 border-on-background font-['Manrope'] text-[10px] font-black uppercase tracking-widest">
        <p className="opacity-60">
          © {new Date().getFullYear()} BRICK_NEGOTIATE. BY ARCHITECTS, FOR ARCHITECTS.
        </p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link className="opacity-60 hover:text-primary transition-colors" href="/">
            Return Home
          </Link>
          <Link className="opacity-60 hover:text-primary transition-colors" href="/legal">
            Terms of Trade
          </Link>
        </div>
      </footer>
    </div>
  );
}
