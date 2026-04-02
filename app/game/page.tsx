'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { PRODUCTS, PERSONALITIES, Product, Personality } from '@/lib/game-data';

interface Message {
  speaker: 'ai' | 'player' | 'user';
  text: string;
  bid?: number;
  sentiment?: string;
}

export default function GamePage() {
  const router = useRouter();
  
  // Selection State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null);
  const [gameStep, setGameStep] = useState<'select' | 'negotiate'>('select');

  // Negotiation State
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [round, setRound] = useState(1);
  const [patience, setPatience] = useState(100);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(0);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'hi-IN'; // Hindi + English support
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserMessage(prev => prev ? prev + ' ' + transcript : transcript);
          setIsListening(false);
        };
        
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        
        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text-to-Speech for AI responses
  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    synth.speak(utterance);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Initialize Game
  const handleStartGame = () => {
    if (selectedProduct && selectedPersonality) {
      const welcomeText = `Welcome! I'm ${selectedPersonality.name}. I see you're interested in the ${selectedProduct.name}. My asking price is $${selectedProduct.marketValue}. What's your offer?`;
      setMessages([
        {
          speaker: 'ai',
          text: welcomeText,
          bid: selectedProduct.marketValue,
          sentiment: 'neutral'
        }
      ]);
      setCurrentOffer(selectedProduct.marketValue);
      setPatience(100 * selectedPersonality.patienceMultiplier);
      setGameStep('negotiate');
      speakText(welcomeText);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isCalculating]);

  useEffect(() => {
    if (timeLeft <= 0 || isGameOver || gameStep === 'select') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isGameOver, gameStep]);

  const handleAcceptDeal = async () => {
    if (isGameOver || isCalculating || !selectedProduct || !selectedPersonality) return;

    setIsCalculating(true);
    try {
      const acceptMsg = { speaker: 'player' as const, text: `I accept your offer of $${currentOffer.toFixed(2)}!` };
      setMessages((prev) => [...prev, acceptMsg]);

      setIsGameOver(true);
      
      await fetch('/api/negotiate/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          finalPrice: currentOffer,
          rounds: round,
          status: 'accepted',
          personality: selectedPersonality,
          history: [...messages, acceptMsg]
        })
      });

      setTimeout(() => {
        router.push(`/result?price=${currentOffer}&rounds=${round}&status=accepted&productId=${selectedProduct.id}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to accept deal:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGameOver || isCalculating || !userMessage.trim() || !selectedProduct || !selectedPersonality) return;

    const newPlayerMessage = {
      speaker: 'player' as const,
      text: userMessage,
    };

    setMessages((prev) => [...prev, newPlayerMessage]);
    setIsCalculating(true);
    
    const originalMsg = userMessage;
    const currentRound = round;
    setUserMessage('');

    try {
      const resp = await fetch('/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: originalMsg,
          history: messages,
          round: currentRound,
          product: selectedProduct,
          personality: selectedPersonality
        }),
      });

      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      const aiMessage = { 
        speaker: 'ai' as const, 
        text: data.response, 
        bid: data.counterOffer,
        sentiment: data.sentiment 
      };

      setMessages((prev) => [...prev, aiMessage]);
      speakText(data.response);
      
      setCurrentOffer(data.counterOffer);
      setPatience((prev) => Math.max(0, Math.floor(prev + (data.patienceChange || -5))));
      setRound((prev) => prev + 1);

      if (data.isDealAccepted || currentRound >= 10 || patience <= 5) {
        setIsGameOver(true);
        
        if (data.isDealAccepted) {
          await fetch('/api/negotiate/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              finalPrice: data.counterOffer,
              rounds: currentRound,
              status: 'accepted',
              personality: selectedPersonality,
              history: [...messages, newPlayerMessage, aiMessage]
            })
          });
        } else {
          // Log failed/walked_away negotiation
          await fetch('/api/negotiate/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              finalPrice: data.counterOffer,
              rounds: currentRound,
              status: patience <= 5 ? 'walked_away' : 'failed',
              personality: selectedPersonality,
              history: [...messages, newPlayerMessage, aiMessage]
            })
          });
        }
        
        setTimeout(() => {
          router.push(`/result?price=${data.counterOffer}&rounds=${currentRound}&status=${data.isDealAccepted ? 'accepted' : 'failed'}&productId=${selectedProduct.id}`);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to negotiate:', error);
      setMessages((prev) => [
        ...prev,
        { speaker: 'ai', text: "Merchant is busy. Try sending your offer again.", bid: currentOffer },
      ]);
    } finally {
      setIsCalculating(false);
    }
  };

  if (gameStep === 'select') {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <main className="pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter">Marketplace</h1>
            <p className="text-on-surface-variant font-bold opacity-60">Choose your challenge and prove your worth.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Column 1: Product Selection */}
            <section className="space-y-6">
              <h2 className="text-2xl font-headline font-black uppercase flex items-center gap-2">
                <span className="material-symbols-outlined">inventory_2</span> 1. Select Product
              </h2>
              <div className="grid gap-4">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`text-left p-4 border-4 rounded-xl transition-all ${selectedProduct?.id === p.id ? 'bg-primary-container border-on-background translate-x-1 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]' : 'bg-white border-on-background/10 hover:border-on-background hover:bg-surface-container'}`}
                  >
                    <div className="flex gap-4 items-center">
                      <img 
                        src={p.image} 
                        className="w-20 h-20 rounded-lg object-cover border-2 border-on-background bg-surface-container" 
                        alt={p.name} 
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-headline font-black uppercase text-lg">{p.name}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border border-on-background ${p.difficulty === 'Easy' ? 'bg-green-300' : p.difficulty === 'Medium' ? 'bg-yellow-300' : 'bg-red-300'}`}>{p.difficulty}</span>
                        </div>
                        <p className="text-xs font-medium opacity-70 line-clamp-1">{p.description}</p>
                        <div className="mt-2 font-headline font-black text-primary">MW: ${p.marketValue}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Column 2: Personality Selection */}
            <section className="space-y-6">
              <h2 className="text-2xl font-headline font-black uppercase flex items-center gap-2">
                <span className="material-symbols-outlined">person_search</span> 2. Select Merchant
              </h2>
              <div className="grid gap-4">
                {PERSONALITIES.map((per) => (
                  <button
                    key={per.id}
                    onClick={() => setSelectedPersonality(per)}
                    className={`text-left p-4 border-4 rounded-xl transition-all ${selectedPersonality?.id === per.id ? 'bg-secondary-container border-on-background translate-x-1 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]' : 'bg-white border-on-background/10 hover:border-on-background hover:bg-surface-container'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-headline font-black uppercase text-lg">{per.name}</span>
                      <span className="text-[10px] font-black uppercase opacity-60">{per.label}</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed">{per.description}</p>
                  </button>
                ))}
              </div>

              <div className="pt-8">
                <button
                  disabled={!selectedProduct || !selectedPersonality}
                  onClick={handleStartGame}
                  className="w-full py-6 bg-on-background text-surface font-headline font-black text-2xl uppercase rounded-2xl brick-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
                >
                  Enter Exchange
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="pt-24 pb-8 md:pt-32 px-4 md:px-8 max-w-7xl mx-auto flex-1 flex flex-col gap-6 md:gap-8 w-full overflow-hidden">
        {/* Header Stats */}
        <header className="flex flex-wrap gap-3 md:gap-4 items-center justify-between">
          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <div className={`flex items-center gap-2 bg-primary-container border-2 md:border-4 border-on-background px-4 md:px-6 py-2 md:py-3 rounded-xl brick-shadow ${round > 8 ? 'bg-red-300' : ''}`}>
              <span className="font-headline font-black text-sm md:text-xl uppercase">Round {round}/10</span>
            </div>
            <div className="flex items-center gap-2 bg-tertiary-container border-2 md:border-4 border-on-background px-4 md:px-6 py-2 md:py-3 rounded-xl brick-shadow">
              <span className="font-headline font-black text-sm md:text-xl uppercase">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary-container border-2 md:border-4 border-on-background px-4 md:px-6 py-2 md:py-3 rounded-xl brick-shadow">
              <span className="font-headline font-black text-sm md:text-xl uppercase">{patience}% Patience</span>
            </div>
          </div>
          {/* Voice toggle */}
          <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)} 
            className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-on-background text-xs font-black uppercase transition-all ${voiceEnabled ? 'bg-primary-container' : 'bg-surface-container opacity-50'}`}
          >
            <span className="material-symbols-outlined text-sm">{voiceEnabled ? 'volume_up' : 'volume_off'}</span>
            {voiceEnabled ? 'Voice On' : 'Voice Off'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start flex-1 min-h-0 overflow-hidden">
          {/* Product Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-surface-container-lowest border-4 border-on-background rounded-2xl overflow-hidden brick-shadow">
              <div className="p-4 md:p-6 space-y-4">
                <img
                  alt={selectedProduct?.name}
                  className="w-full aspect-square md:aspect-video lg:aspect-square object-cover rounded-xl border-2 border-on-background"
                  src={selectedProduct?.image}
                />
                <div className="space-y-1">
                  <h2 className="font-headline font-black text-xl uppercase leading-tight">{selectedProduct?.name}</h2>
                  <p className="text-[10px] font-bold opacity-60 uppercase">{selectedProduct?.difficulty} Difficulty Challenge</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-on-background">
                  <div>
                    <span className="block text-[8px] font-black uppercase opacity-40">Target Price</span>
                    <span className="font-headline font-black text-xl">${selectedProduct?.marketValue.toFixed(0)}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] font-black uppercase opacity-40">Lowest Offer</span>
                    <span className="font-headline font-black text-xl text-primary">${currentOffer.toFixed(0)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary-container border-t-4 border-on-background">
                <button
                  onClick={handleAcceptDeal}
                  disabled={isGameOver || isCalculating}
                  className="w-full bg-on-background text-surface font-headline font-black py-4 rounded-xl brick-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:scale-95 transition-all disabled:opacity-50"
                >
                  SIGN THE CONTRACT
                </button>
              </div>
            </div>

            {/* Merchant Persona Card */}
            <div className="bg-surface-container border-2 border-on-background p-4 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-on-background text-surface rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <div className="text-[10px] font-black opacity-50 uppercase mb-0.5">Your Dealer</div>
                <div className="font-headline font-black uppercase text-sm">{selectedPersonality?.name}</div>
              </div>
            </div>
          </aside>

          {/* Chat Interface */}
          <section className="lg:col-span-8 flex flex-col h-[500px] md:h-full bg-white border-4 border-on-background rounded-2xl brick-shadow-lg relative overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.speaker === 'player' ? 'items-end ml-auto' : 'items-start'} max-w-[85%]`}>
                  <div className={`p-4 rounded-2xl border-2 border-on-background ${
                    m.speaker === 'ai' 
                    ? 'bg-primary-container rounded-tl-none' 
                    : 'bg-secondary-container rounded-tr-none'
                  } brick-shadow-sm relative`}>
                    <p className="font-body font-bold text-sm md:text-base leading-snug">
                      {m.text}
                    </p>
                    {m.bid && (
                      <div className="mt-2 text-[10px] font-black opacity-60 border-t border-on-background/10 pt-1">
                        OFFER: ${m.bid.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isCalculating && (
                <div className="flex gap-1.5 p-2 animate-pulse">
                  <span className="w-2 h-2 bg-on-background rounded-full"></span>
                  <span className="w-2 h-2 bg-on-background rounded-full"></span>
                  <span className="w-2 h-2 bg-on-background rounded-full"></span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 md:p-6 bg-surface-container border-t-4 border-on-background">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  disabled={isGameOver || isCalculating}
                  className="flex-1 bg-white border-2 border-on-background rounded-xl p-4 font-body font-bold placeholder:opacity-40 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50"
                  placeholder="Type your price & message... (e.g. 'bhai 200 mein de do')"
                />
                {/* Mic Button */}
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={isGameOver || isCalculating}
                  className={`px-4 rounded-xl border-2 border-on-background flex items-center justify-center transition-all ${isListening ? 'bg-red-400 animate-pulse border-red-600' : 'bg-tertiary-container hover:scale-105'} disabled:opacity-20`}
                >
                  <span className="material-symbols-outlined">{isListening ? 'stop_circle' : 'mic'}</span>
                </button>
                {/* Send */}
                <button
                  disabled={isGameOver || isCalculating}
                  className="bg-primary-container border-4 border-on-background rounded-xl px-6 flex items-center justify-center brick-shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                  type="submit"
                >
                  <span className="material-symbols-outlined font-black">send</span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
