'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center font-headline text-3xl animate-pulse">BUILDING PROFILE...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="pt-32 px-4 md:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-surface-container border-4 border-on-background rounded-2xl p-6 md:p-12 brick-shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-12">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary-container border-4 border-on-background rounded-full flex items-center justify-center text-4xl md:text-5xl brick-shadow font-headline font-black">
              {session?.user?.name?.[0] || 'B'}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-headline font-black uppercase mb-1">{session?.user?.name || 'Master Builder'}</h1>
              <p className="text-on-surface-variant font-bold opacity-60 uppercase tracking-widest text-[10px] md:text-xs">{session?.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-12 font-body">
            <div className="p-6 bg-surface-container-high border-2 border-on-background rounded-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Account Status</h3>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-secondary rounded-full"></span>
                <span className="font-bold uppercase text-xs md:text-sm">Verified Architect</span>
              </div>
            </div>
            <div className="p-6 bg-surface-container-high border-2 border-on-background rounded-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Contractor Level</h3>
              <div className="font-bold uppercase text-xs md:text-sm text-primary">Senior Negotiator</div>
            </div>
          </div>

          <div className="space-y-4">
            <Link 
              href="/dashboard"
              className="block w-full text-center py-4 bg-primary-container border-4 border-on-background font-headline text-lg md:text-xl font-black uppercase brick-shadow hover:translate-y-[-2px] transition-all"
            >
              View My Stats
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full py-4 bg-surface-container-lowest border-4 border-on-background font-headline text-lg md:text-xl font-black uppercase hover:bg-error hover:text-white transition-all"
            >
              Deconstruct Session (Sign Out)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
