'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface bg-[radial-gradient(#d1c5ae_1px,transparent_1px)] bg-[size:32px_32px]">
      <Navbar />
      <main className="grow flex flex-col items-center justify-center p-6 text-center mt-20">
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0], y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-40 h-40 md:w-56 md:h-56 mb-12"
        >
          <div className="absolute inset-0 bg-[#E63946] border-8 border-on-background rounded-2xl shadow-[16px_16px_0px_0px_rgba(17,17,17,1)] flex items-center justify-center overflow-hidden">
             {/* Diagonal stripes for danger feel */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
             <span className="material-symbols-outlined text-[80px] md:text-[120px] text-white font-black z-10 relative">extension_off</span>
          </div>
          
          {/* Floating debris */}
          <motion.div 
            animate={{ y: [0, 15, 0], rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute -top-8 -right-8 w-16 h-16 bg-[#F4C542] border-4 border-on-background rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
          >
            <div className="w-6 h-6 rounded-full bg-on-background/20" />
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -left-6 w-20 h-20 bg-primary-container border-4 border-on-background rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]"
          >
            <div className="w-8 h-8 rounded-full bg-on-background/20" />
          </motion.div>
        </motion.div>

        <div className="inline-block bg-[#F4C542] border-4 border-[#111111] px-4 py-2 rounded-lg font-headline font-black uppercase tracking-widest text-[#111111] mb-6 -rotate-2 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
          System Alert
        </div>

        <h1 className="text-6xl md:text-8xl font-headline font-black uppercase tracking-tighter mb-4 text-[#111111]">
          404<span className="text-primary-container">_</span>ERROR
        </h1>
        
        <p className="text-lg md:text-2xl font-headline font-bold mb-12 max-w-xl opacity-80 uppercase tracking-tight leading-relaxed">
          Brick Not Found. The master builders couldn't locate this module in the archives.
        </p>

        <Link 
          href="/" 
          className="bg-on-background text-surface px-8 py-5 rounded-xl font-headline font-black text-lg md:text-xl uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(244,197,66,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-on-background"
        >
          <span className="material-symbols-outlined">home</span>
          Return to Base Station
        </Link>
      </main>
    </div>
  );
}
