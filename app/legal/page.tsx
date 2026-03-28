'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="grow pt-28 pb-20 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2 font-headline font-black uppercase text-sm mb-8 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Base
        </Link>
        
        <div className="bg-white border-4 border-on-background rounded-2xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
          <div className="mb-12 border-b-4 border-on-background pb-8">
            <h1 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter mb-4">Legal <span className="text-primary">Docs</span></h1>
            <p className="font-body font-bold text-on-surface-variant max-w-lg">By operating within the Brick Negotiate simulation, you agree to the following terms and our data classification protocols.</p>
          </div>

          <article className="prose prose-lg prose-headings:font-headline prose-headings:font-black prose-headings:uppercase prose-p:font-body prose-p:font-medium prose-p:text-on-surface-variant max-w-none">
            <h2>Terms of Service</h2>
            <p>Welcome to Brick Negotiate. By accessing our platform, you agree to engage in fair and standard negotiation practices with our AI entities.</p>
            <ul>
              <li><strong>Currency (Studs):</strong> All virtual currency (Studs) acquired in-game hold no monetary value outside of this platform and cannot be redeemed for legal tender.</li>
              <li><strong>Behavior:</strong> Any attempts to inject malicious prompts, bypass the AI's logic strictures, or abuse the system will result in immediate termination of the Constructor Account.</li>
            </ul>

            <h2 className="mt-12">Privacy Policy</h2>
            <p>We take the protection of your digital blueprints seriously. Here is how we handle your data:</p>
            <ul>
              <li><strong>Authentication Data:</strong> Login sessions are securely processed via standard OAuth and Credentials protocols. We do not store raw passwords; all secure keys are heavily hashed (bcrypt).</li>
              <li><strong>Negotiation Records:</strong> We maintain a ledger of your negotiation rounds (bids, offers, sentiment analysis) strictly for generating your Dashboard Analytics and improving the AI's realism.</li>
              <li><strong>Third-Party Sharing:</strong> We do not sell your data to any third-party merchant guilds.</li>
            </ul>

            <p className="mt-12 text-sm italic opacity-60">Last Updated: March 2026. This is a demonstration application.</p>
          </article>
        </div>
      </main>
    </div>
  );
}
