'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] flex-col z-40 bg-[#F0EDEC] dark:bg-[#1A1A1A] w-64 border-r-4 border-[#111111] font-['Manrope'] font-semibold text-sm uppercase tracking-wider hidden lg:flex">
      <div className="p-6 border-b-2 border-[#111111]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-[#111111] bg-primary-container overflow-hidden flex items-center justify-center">
            {session?.user?.name ? (
              <span className="font-headline font-black text-xl">{session.user.name[0]}</span>
            ) : (
              <span className="material-symbols-outlined">person</span>
            )}
          </div>
          <div>
            <div className="text-[#111111] dark:text-[#FCF9F8] font-extrabold text-xs truncate max-w-[150px]">
              {session?.user?.name || 'Guest Builder'}
            </div>
            <div className="text-[9px] opacity-60 font-bold tracking-widest uppercase">
              {session ? 'Verified Architect' : 'Anonymous'}
            </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        <Link 
          href="/" 
          className={`flex items-center gap-3 p-4 hover:bg-[#EBE7E7] dark:hover:bg-[#2A2A2A] transition-all hover:translate-x-1 ${pathname === '/' ? 'text-primary' : 'text-[#111111] dark:text-[#FCF9F8]'}`}
        >
          <span className="material-symbols-outlined">home</span> Home
        </Link>
        <Link 
          href={session ? "/game" : "/auth"} 
          className={`flex items-center gap-3 p-4 hover:bg-[#EBE7E7] dark:hover:bg-[#2A2A2A] transition-all hover:translate-x-1 ${pathname === '/game' ? 'text-primary' : 'text-[#111111] dark:text-[#FCF9F8]'}`}
        >
          <span className="material-symbols-outlined">play_arrow</span> New Game
        </Link>
        <Link 
          href="/leaderboard" 
          className={`flex items-center gap-3 p-4 hover:bg-[#EBE7E7] dark:hover:bg-[#2A2A2A] transition-all hover:translate-x-1 ${pathname === '/leaderboard' ? 'bg-[#F4C542] text-[#111111] border-y-2 border-[#111111]' : 'text-[#111111] dark:text-[#FCF9F8]'}`}
        >
          <span className="material-symbols-outlined">leaderboard</span> Leaderboard
        </Link>
        {session && (
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-3 p-4 hover:bg-[#EBE7E7] dark:hover:bg-[#2A2A2A] transition-all hover:translate-x-1 ${pathname === '/dashboard' ? 'bg-[#F4C542] text-[#111111] border-y-2 border-[#111111]' : 'text-[#111111] dark:text-[#FCF9F8]'}`}
          >
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </Link>
        )}
      </nav>

      <div className="p-4 mt-auto border-t-2 border-[#111111]">
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg border-2 border-transparent hover:border-on-background transition-all">
          <span className="material-symbols-outlined">settings</span> Settings
        </Link>
      </div>
    </aside>
  );
}
