'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { PRODUCTS } from '@/lib/game-data';

interface NegotiationLog {
  finalPrice: number;
  rounds: number;
  status: string;
  productName: string;
  productId: string;
  history: any[];
}

function ResultContent() {
  const searchParams = useSearchParams();
  const price = parseFloat(searchParams.get('price') || '0');
  const rounds = parseInt(searchParams.get('rounds') || '0');
  const status = searchParams.get('status') || 'failed';
  const productId = searchParams.get('productId') || 'modular-tower';

  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const isSuccess = status === 'accepted';
  
  // Calculate rewards
  const savings = Math.max(0, product.marketValue - price);
  const reward = isSuccess ? Math.floor(savings * 5) + 100 : 0;
  const efficiency = Math.round((savings / (product.marketValue - product.hardMinimum)) * 100);

  // Simple SVG Line Graph for rounds
  const generateGraph = () => {
    const points = [];
    const maxVal = product.marketValue * 1.1;
    const minVal = product.hardMinimum * 0.8;
    const range = maxVal - minVal;
    
    // Initial Price
    points.push(`0,${100 - ((product.marketValue - minVal) / range) * 100}`);
    
    // Final Price (representing the trend)
    points.push(`${rounds * 20},${100 - ((price - minVal) / range) * 100}`);

    return points.join(' ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Result Hero */}
      <div className="lg:col-span-8 space-y-8">
        <div className={`${isSuccess ? 'bg-[#F4C542]' : 'bg-[#E63946]'} border-4 border-[#111111] rounded-2xl brick-shadow-lg overflow-hidden relative p-8 md:p-12`}>
          <div className="relative z-10">
            <span className="inline-block bg-[#111111] text-white font-headline font-black text-xs px-4 py-1 rounded-full mb-6 uppercase tracking-widest">
              Negotiation Result
            </span>
            <h1 className="text-5xl md:text-8xl font-headline font-black uppercase tracking-tighter leading-none mb-6">
              {isSuccess ? 'Deal Locked!' : 'No Deal'}
            </h1>
            <p className={`text-lg md:text-2xl font-bold ${isSuccess ? 'text-black/80' : 'text-white/90'} max-w-xl`}>
              {isSuccess 
                ? `You've acquired the ${product.name} for $${price.toFixed(2)}. Excellent trading.`
                : `The merchant walked away. The ${product.name} remains on the shelf.`}
            </p>
          </div>
          {/* Background Stud Decoration */}
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <span className="material-symbols-outlined text-[300px]">token</span>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white border-4 border-[#111111] rounded-2xl brick-shadow overflow-hidden">
          <div className="bg-[#111111] p-4 flex justify-between items-center text-white">
            <h3 className="font-headline font-black uppercase text-sm tracking-widest">Negotiation Analytics</h3>
            <span className="text-[10px] font-bold opacity-60">PRICE TREND PER ROUND</span>
          </div>
          <div className="p-8 flex flex-col md:flex-row gap-12 items-center">
            {/* SVG Graph Placeholder */}
            <div className="w-full md:w-1/2 h-40 bg-surface-container rounded-xl border-2 border-on-background relative overflow-hidden">
               <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                 <path 
                   d={`M ${generateGraph()}`} 
                   fill="none" 
                   stroke={isSuccess ? "#1E6F9F" : "#E63946"} 
                   strokeWidth="4" 
                   strokeLinecap="round"
                 />
                 {/* Current Price Line */}
                 <line x1="0" y1="50" x2="200" y2="50" stroke="#111111" strokeDasharray="4" opacity="0.1" />
               </svg>
               <div className="absolute top-2 left-2 text-[8px] font-black opacity-40">START: ${product.marketValue}</div>
               <div className="absolute bottom-2 right-2 text-[8px] font-black opacity-40">FINAL: ${price}</div>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full md:w-1/2">
              <div>
                <div className="text-[10px] font-black uppercase opacity-40">Efficiency</div>
                <div className="text-3xl font-headline font-black">{isSuccess ? efficiency : 0}%</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase opacity-40">Rounds Spent</div>
                <div className="text-3xl font-headline font-black">{rounds}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase opacity-40">Studs Earned</div>
                <div className="text-3xl font-headline font-black text-secondary">+{reward}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase opacity-40">Market Savings</div>
                <div className="text-3xl font-headline font-black">${savings.toFixed(0)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Product Info */}
      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-white border-4 border-[#111111] rounded-2xl brick-shadow overflow-hidden">
          <div className="aspect-square bg-surface-container">
            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          </div>
          <div className="p-6">
            <h3 className="font-headline font-black uppercase text-xl leading-tight">{product.name}</h3>
            <p className="text-xs font-bold opacity-60 mt-2 uppercase tracking-widest">{product.difficulty} Difficulty</p>
          </div>
        </div>

        <div className="bg-[#111111] text-white p-6 rounded-2xl brick-shadow space-y-6">
          <h3 className="font-headline font-black uppercase tracking-widest text-sm border-b border-white/10 pb-2">Next Steps</h3>
          <Link href="/game" className="block w-full text-center py-4 bg-[#F4C542] text-[#111111] font-headline font-black uppercase rounded-lg hover:scale-105 active:scale-95 transition-all">
            New Negotiation
          </Link>
          <Link href="/dashboard" className="block w-full text-center py-4 border-2 border-white/20 font-headline font-black uppercase rounded-lg hover:bg-white/10 transition-all">
            Go to Gallery
          </Link>
        </div>
      </aside>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Suspense fallback={<div className="text-center font-headline font-black text-4xl animate-pulse">ARCHIVING DEAL...</div>}>
          <ResultContent />
        </Suspense>
      </main>
    </div>
  );
}
