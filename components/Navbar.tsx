'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-20 bg-[#FCF9F8] border-b-4 border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl md:text-2xl font-black text-[#111111] uppercase tracking-tighter">
          BRICK_NEGOTIATE
        </Link>
      </div>

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

      <div className="flex items-center gap-3 md:gap-4">
        {session ? (
          <>
            <Link 
              href="/profile" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] ${pathname === '/profile' ? 'bg-[#F4C542]' : 'bg-[#EAE4DA] hover:bg-[#F4C542]'} transition-all active:translate-y-0.5 active:shadow-none`}
            >
              <span className="material-symbols-outlined text-lg font-bold">account_circle</span>
              <span className="hidden sm:inline font-headline font-black text-xs uppercase tracking-tighter">{session.user?.name?.split(' ')[0]}</span>
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              className="font-headline font-black text-[10px] md:text-sm uppercase px-4 py-2 bg-[#E63946] text-white border-2 border-[#111111] rounded shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] active:translate-y-0.5 active:shadow-none transition-all"
            >
              Log Out
            </button>
          </>
        ) : (
          <Link href="/auth" className="font-headline font-black text-sm uppercase px-6 py-2 bg-[#F4C542] border-2 border-[#111111] rounded hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
