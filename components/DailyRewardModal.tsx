'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyRewardModal() {
  const [show, setShow] = useState(false);
  const [streak, setStreak] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [bonus, setBonus] = useState(0);

  useEffect(() => {
    async function checkStreak() {
      try {
        const res = await fetch('/api/user/daily-claim');
        const data = await res.json();
        if (data.canClaim) {
          setStreak(data.streak || 0);
          setShow(true);
        }
      } catch (err) {
        console.error("Streak check failed");
      }
    }
    // Small delay so dashboard loads first
    const timer = setTimeout(checkStreak, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch('/api/user/daily-claim', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStreak(data.streak);
        setBonus(data.bonus);
        setClaimed(true);
        // Auto-close after showing reward
        setTimeout(() => setShow(false), 3000);
      }
    } catch (err) {
      console.error("Claim failed");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => !claiming && setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-4 border-on-background rounded-3xl p-8 md:p-10 max-w-md w-full brick-shadow-lg text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5 stud-pattern pointer-events-none" />
            
            {!claimed ? (
              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary-container border-4 border-on-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                </div>
                
                <h2 className="font-headline font-black text-3xl uppercase tracking-tight mb-2">Daily Reward!</h2>
                <p className="text-on-surface-variant font-bold text-sm mb-6">
                  Your current streak: <span className="text-primary font-black text-lg">{streak} {streak === 1 ? 'day' : 'days'} 🔥</span>
                </p>
                
                <div className="bg-surface-container border-2 border-on-background/20 rounded-xl p-4 mb-8">
                  <div className="text-[10px] font-black uppercase opacity-40 mb-1">Today's Bonus</div>
                  <div className="text-4xl font-headline font-black text-primary">
                    +{Math.min(200, 50 + streak * 10)} Studs
                  </div>
                </div>
                
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full py-5 bg-on-background text-surface font-headline font-black text-xl uppercase rounded-2xl brick-shadow hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(244,197,66,1)] active:scale-95 transition-all disabled:opacity-50"
                >
                  {claiming ? 'Claiming...' : 'Claim Studs!'}
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="relative z-10"
              >
                <div className="w-24 h-24 bg-green-400 border-4 border-on-background rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-5xl text-white">check_circle</span>
                </div>
                <h2 className="font-headline font-black text-3xl uppercase mb-2">Claimed! 🎉</h2>
                <p className="text-2xl font-headline font-black text-primary">+{bonus} Studs</p>
                <p className="text-sm font-bold opacity-60 mt-2">🔥 {streak} Day Streak!</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
