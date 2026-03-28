'use client';

import { useState, useEffect } from 'react';

interface OnboardingGuideProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome, Architect!",
    content: "Ready to master the high-stakes world of brick negotiation? We've prepared a quick 1-minute briefing for you.",
    icon: "waver",
    button: "Let's Begin"
  },
  {
    title: "Play Game",
    content: "This is the core exchange. You'll face AI merchants with distinct personalities. Negotiate the best price for rare modular sets by balancing your bid and their patience.",
    icon: "sports_esports",
    button: "Next Intelligence"
  },
  {
    title: "Dashboard",
    content: "Your mission control. Monitor your 'Studs' balance, view your physical inventory in the Display Case, and track your negotiation efficiency scores.",
    icon: "dashboard",
    button: "Final Brief"
  },
  {
    title: "Leaderboard",
    content: "The global arena. Compete against others to become the 'Grand Architect'. Top negotiators are featured weekly on the main exchange.",
    icon: "leaderboard",
    button: "Start Trading"
  }
];

export default function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is the "Want a tour?" prompt
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      await finish();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const finish = async () => {
    try {
      localStorage.setItem('brick_negotiate_onboarded', 'true');
      const res = await fetch('/api/user/onboarding/complete', { method: 'POST' });
      if (res.ok) onComplete();
      else onComplete(); // Still close if API fails
    } catch (error) {
      console.error("Failed to save onboarding status:", error);
      onComplete(); // Still close the modal
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-sm p-6">
      <div className="w-full max-w-lg bg-surface border-4 border-on-background rounded-2xl brick-shadow-lg p-8 md:p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 stud-pattern opacity-10 -rotate-12 translate-x-12 -translate-y-12"></div>
        
        {currentStep === -1 ? (
          <div className="relative z-10 text-center space-y-8">
            <div className="w-20 h-20 bg-primary-container border-4 border-on-background rounded-2xl mx-auto flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
              <span className="material-symbols-outlined text-4xl font-black">tour</span>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-black uppercase tracking-tighter mb-4">First Time Here?</h2>
              <p className="text-lg font-bold opacity-70 leading-relaxed">
                Would you like a quick operative briefing on how the Brick Exchange works?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setCurrentStep(0)}
                className="flex-1 py-4 bg-primary-container text-on-background font-headline font-black uppercase border-4 border-on-background brick-shadow hover:translate-y-[-2px] active:translate-y-0 transition-all"
              >
                Show Me Around
              </button>
              <button 
                onClick={finish}
                className="flex-1 py-4 bg-surface-container-highest text-on-background font-headline font-black uppercase border-4 border-on-background hover:bg-surface-variant transition-colors"
              >
                I'll Figure It Out
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black uppercase tracking-widest bg-on-background text-surface px-3 py-1 rounded">
                Step {currentStep + 1} / {steps.length}
              </div>
              <button onClick={finish} className="text-xs font-black uppercase opacity-40 hover:opacity-100 transition-opacity">Skip Tour</button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary-container border-2 border-on-background rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
                        <span className="material-symbols-outlined font-bold">{steps[currentStep].icon}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-headline font-black uppercase tracking-tighter">{steps[currentStep].title}</h2>
                </div>
                <p className="text-lg font-medium leading-relaxed opacity-80 min-h-[80px]">
                    {steps[currentStep].content}
                </p>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleNext}
                className="w-full py-5 bg-on-background text-surface font-headline text-xl font-black uppercase tracking-tight border-4 border-on-background brick-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(244,197,66,1)] active:scale-95 transition-all"
              >
                {steps[currentStep].button}
              </button>
            </div>
            
            {/* Progress Bars */}
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 border-2 border-on-background rounded-full transition-all duration-300 ${i <= currentStep ? 'bg-primary-container' : 'bg-surface-container'}`}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
