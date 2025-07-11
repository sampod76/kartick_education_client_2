import { useEffect } from 'react';

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function TurnstileWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="cf-turnstile"
      data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      data-theme="light"
    />
  );
}
