'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-20 bg-[#FCF9F8] border-b-4 border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] relative">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl md:text-2xl font-black text-[#111111] uppercase tracking-tighter">
            BRICK_NEGOTIATE
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 font-headline font-black tracking-tight uppercase text-sm">
          <Link 
            href={session ? "/game" : "/auth"} 
            className={`${pathname === '/game' ? 'text-[#F4C542] border-b-4 border-[#F4C542]' : 'text-[#111111] hover:text-[#F4C542]'} pb-1 transition-all duration-200`}
          >
            {session ? "Play Game" : "Start Playing"}
          </Link>
          <Link 
            href="/leaderboard" 
            className={`${pathname === '/leaderboard' ? 'text-[#F4C542] border-b-4 border-[#F4C542]' : 'text-[#111111] hover:text-[#F4C542]'} pb-1 transition-all duration-200`}
          >
            Leaderboard
          </Link>
          {session && (
            <Link 
              href="/dashboard" 
              className={`${pathname === '/dashboard' ? 'text-[#F4C542] border-b-4 border-[#F4C542]' : 'text-[#111111] hover:text-[#F4C542]'} pb-1 transition-all duration-200`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Profile & Logout */}
        <div className="hidden lg:flex items-center gap-3 md:gap-4">
          {session ? (
            <>
              <Link 
                href="/profile" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] ${pathname === '/profile' ? 'bg-[#F4C542]' : 'bg-[#EAE4DA] hover:bg-[#F4C542]'} transition-all active:translate-y-0.5 active:shadow-none`}
              >
                <span className="material-symbols-outlined text-lg font-bold">account_circle</span>
                <span className="font-headline font-black text-xs uppercase tracking-tighter">{session.user?.name?.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="font-headline font-black text-sm uppercase px-4 py-2 bg-[#E63946] text-white border-2 border-[#111111] rounded shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] active:translate-y-0.5 active:shadow-none transition-all"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link href="/auth" className="font-headline font-black text-sm uppercase px-6 py-2 bg-[#F4C542] border-2 border-[#111111] rounded hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 border-2 border-[#111111] rounded bg-[#F4C542] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center"
          >
            <span className="material-symbols-outlined font-bold text-xl">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-20 left-0 w-full bg-[#FCF9F8] border-b-4 border-[#111111] z-40 px-6 py-8 flex flex-col gap-6 shadow-[0px_8px_0px_0px_rgba(17,17,17,1)]"
          >
            <Link onClick={() => setIsMenuOpen(false)} href={session ? "/game" : "/auth"} className="font-headline font-black uppercase text-xl text-[#111111] flex items-center justify-between border-b-2 border-black/10 pb-4">
              <span>{session ? "Play Game" : "Start Playing"}</span>
              <span className="material-symbols-outlined">casino</span>
            </Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/leaderboard" className="font-headline font-black uppercase text-xl text-[#111111] flex items-center justify-between border-b-2 border-black/10 pb-4">
              <span>Leaderboard</span>
              <span className="material-symbols-outlined">social_leaderboard</span>
            </Link>
            {session && (
              <>
                <Link onClick={() => setIsMenuOpen(false)} href="/dashboard" className="font-headline font-black uppercase text-xl text-[#111111] flex items-center justify-between border-b-2 border-black/10 pb-4">
                  <span>Dashboard</span>
                  <span className="material-symbols-outlined">dashboard</span>
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} href="/profile" className="font-headline font-black uppercase text-xl text-[#111111] flex items-center justify-between border-b-2 border-black/10 pb-4">
                  <span>My Profile</span>
                  <span className="material-symbols-outlined">account_circle</span>
                </Link>
                <button 
                  onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: '/' }); }} 
                  className="mt-4 w-full font-headline font-black text-lg uppercase px-4 py-4 bg-[#E63946] text-white border-4 border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-y-1 active:shadow-none transition-all flex justify-center items-center gap-2"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Log Out
                </button>
              </>
            )}
            {!session && (
              <Link onClick={() => setIsMenuOpen(false)} href="/auth" className="mt-4 w-full font-headline font-black text-lg uppercase px-4 py-4 bg-[#F4C542] text-[#111111] border-4 border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-y-1 active:shadow-none transition-all flex justify-center items-center gap-2">
                <span className="material-symbols-outlined">login</span>
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
