import React from 'react';

function isMobileOrTelegram(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  // Telegram's in-app browser sets a specific user agent
  const isTelegram = /Telegram/i.test(ua);
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  return isTelegram || isMobile;
}

export default function FloatingLkButton() {
  const newTab = !isMobileOrTelegram();
  return (
    <a
      href="https://lk.wifimax.me"
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
      style={{ textDecoration: 'none' }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-blue-600 px-5 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] active:scale-95 sm:bottom-8 sm:right-8"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="font-bold tracking-wide text-sm sm:text-base cursor-pointer">Личный кабинет</span>
    </a>
  );
}
