'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function FeedbackSticker() {
  const { status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'bug' | 'suggestion' | 'praise' | 'other'>('suggestion');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (status !== 'authenticated') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, rating, type })
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          setMessage('');
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Sticker Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] bg-[#F4C542] text-[#111111] border-4 border-[#111111] px-6 py-4 font-headline font-black uppercase tracking-tighter text-lg shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 group"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">chat_bubble</span>
          FEEDBACK
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[70] cursor-crosshair"
            />

            {/* Modal */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50, rotate: 2 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[500px] bg-white border-4 border-[#111111] p-8 z-[80] shadow-[16px_16px_0px_0px_rgba(17,17,17,1)]"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[#111111] opacity-40 hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-4xl">close</span>
              </button>

              {submitted ? (
                <div className="py-12 text-center">
                  <span className="material-symbols-outlined text-7xl text-primary animate-bounce mb-6">verified</span>
                  <h2 className="font-headline text-3xl font-black uppercase mb-2">Message Captured!</h2>
                  <p className="font-body font-bold opacity-60">The Brick Architect has received your log.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <header>
                    <h2 className="font-headline text-3xl font-black uppercase mb-2 tracking-tighter italic">Transmission</h2>
                    <p className="font-body font-bold text-on-surface-variant">How can we improve the modular experience?</p>
                  </header>

                  <div className="grid grid-cols-2 gap-3">
                    {['suggestion', 'bug', 'praise', 'other'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t as any)}
                        className={`py-2 border-2 border-[#111111] font-headline text-[10px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-primary shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]' : 'bg-surface hover:bg-surface-variant/10 opacity-40'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your bug, suggest a product, or just say hello..."
                    required
                    rows={4}
                    className="w-full bg-surface border-4 border-[#111111] p-4 font-body font-bold text-lg placeholder:opacity-30 focus:outline-none focus:bg-white resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map((s) => (
                         <button 
                           key={s} 
                           type="button" 
                           onClick={() => setRating(s)}
                           className={`material-symbols-outlined text-3xl transition-all ${s <= rating ? 'text-[#F4C542] fill-1 scale-110' : 'text-[#111111] opacity-20 hover:opacity-40'}`}
                         >
                           star
                         </button>
                       ))}
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-[#111111] text-white px-8 py-4 font-headline font-black uppercase tracking-widest hover:bg-primary hover:text-[#111111] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Transmit'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
