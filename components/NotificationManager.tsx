'use client';

import { useEffect } from 'react';
import { PRODUCTS } from '@/lib/game-data';

export default function NotificationManager() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    // Request permission on mount
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Send a welcome notification if permission granted
    if (Notification.permission === 'granted') {
      const lastNotif = localStorage.getItem('brick_last_notification');
      const today = new Date().toDateString();
      
      if (lastNotif !== today) {
        // Pick a random product to promote
        const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        
        setTimeout(() => {
          new Notification('🧱 Brick Negotiate', {
            body: `Today's Hot Deal: ${randomProduct.name} — Market Value: $${randomProduct.marketValue}. Don't forget to claim your daily studs!`,
            icon: '/favicon.ico',
            tag: 'daily-reminder'
          });
          localStorage.setItem('brick_last_notification', today);
        }, 5000);
      }
    }
  }, []);

  return null; // Invisible component
}
