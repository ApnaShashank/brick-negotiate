'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError(res.error);
        } else {
          router.push('/dashboard');
        }
      } else {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          // Auto login after signup
          await signIn('credentials', {
            email,
            password,
            callbackUrl: '/dashboard',
          });
        } else {
          setError(data.error || 'Signup failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow flex items-center justify-center px-6 py-20 bg-[radial-gradient(#d1c5ae_1px,transparent_1px)] bg-size-[32px_32px]">
        <div className="w-full max-w-md relative">
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary rounded-full border-4 border-on-background z-0"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-secondary rounded-full border-4 border-on-background z-0"></div>
          
          <div className="relative z-10 bg-surface-container-lowest border-4 border-on-background rounded-xl brick-shadow p-8 md:p-10">
            <div className="mb-10 text-center">
              <h1 className="font-headline text-4xl font-black uppercase tracking-tighter mb-2">
                BRICK<span className="text-secondary">_</span>NEGOTIATE
              </h1>
              <p className="font-label text-sm font-bold uppercase tracking-widest text-outline">
                {isLogin ? 'Welcome Back, Builder' : 'Join the Brick Exchange'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container border-2 border-error rounded-lg text-xs font-bold uppercase">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="font-label text-xs font-extrabold uppercase tracking-wider block ml-1" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-4 bg-transparent border-2 border-on-background rounded-lg focus:ring-0 focus:border-4 transition-all placeholder:text-outline-variant font-semibold"
                      id="name"
                      placeholder="Alex Mason"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="font-label text-xs font-extrabold uppercase tracking-wider block ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-4 bg-transparent border-2 border-on-background rounded-lg focus:ring-0 focus:border-4 transition-all placeholder:text-outline-variant font-semibold"
                    id="email"
                    placeholder="master_builder@bricks.io"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    alternate_email
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs font-extrabold uppercase tracking-wider block ml-1" htmlFor="password">
                  Security Key
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-4 bg-transparent border-2 border-on-background rounded-lg focus:ring-0 focus:border-4 transition-all placeholder:text-outline-variant font-semibold"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    lock
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  className="w-full py-4 bg-secondary text-on-secondary font-headline text-lg font-bold uppercase tracking-tight border-4 border-on-background rounded-lg brick-shadow-sm hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : isLogin ? 'Assemble Profile' : 'Start Building Account'}
                  <span className="material-symbols-outlined">login</span>
                </button>
              </div>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-on-background"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface-container-lowest px-4 font-label font-black uppercase tracking-widest">Or</span>
              </div>
            </div>

            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="w-full py-3 bg-primary-container text-on-primary-container border-2 border-on-background rounded-lg font-bold text-sm uppercase flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">{isLogin ? 'person_add' : 'login'}</span>
              {isLogin ? 'New Constructor Account' : 'Back to Login'}
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 px-12 flex flex-col md:flex-row justify-between items-center mt-auto border-t-4 border-[#111111] bg-[#EAE4DA] dark:bg-[#0A0A0A]">
        <div className="font-['Manrope'] text-xs font-bold uppercase tracking-widest text-[#111111] dark:text-[#FCF9F8]">
          © 2024 BRICK_NEGOTIATE.
        </div>
      </footer>
    </div>
  );
}
