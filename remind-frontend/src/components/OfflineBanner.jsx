// src/components/OfflineBanner.jsx
//
// A calm banner instead of a broken screen or spinner when there's no
// connection — per blueprint Chapter 03.2.

import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    function goOnline() { setOnline(true); }
    function goOffline() { setOnline(false); }
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="w-full bg-alert-light text-charcoal text-center text-sm py-2 px-4 font-medium">
      You're offline — showing your last saved data. It'll sync once you're back online.
    </div>
  );
}
