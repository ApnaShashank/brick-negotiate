'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface BidPopUpProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function BidPopUp({ isVisible, onClose }: BidPopUpProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-on-background/20 backdrop-blur-[2px]">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 5 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="w-full max-w-sm bg-primary-container border-4 border-on-background rounded-2xl brick-shadow-lg p-8 text-center relative overflow-hidden"
          >
             {/* Warning Icon Background */}
             <div className="absolute -top-4 -left-4 w-16 h-16 bg-on-background/10 rounded-full flex items-center justify-center -rotate-12 translate-x-2 translate-y-2">
                <span className="material-symbols-outlined text-4xl opacity-20">warning</span>
             </div>

            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-on-background text-surface rounded-2xl mx-auto flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                <span className="material-symbols-outlined text-3xl font-black">currency_exchange</span>
              </div>
              
              <div>
                <h2 className="text-2xl md:text-3xl font-headline font-black uppercase tracking-tighter mb-2">Bid Missing!</h2>
                <p className="text-sm font-bold opacity-80 uppercase leading-relaxed">
                  The operative must provide a valuation before the proposal can be transmitted. <br/>
                  <span className="text-on-primary-container font-black">Enter the bid please!</span>
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-on-background text-surface font-headline font-black uppercase tracking-tight border-4 border-on-background hover:scale-105 active:scale-95 transition-all brick-shadow-sm"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
