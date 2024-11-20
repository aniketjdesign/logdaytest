import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Check if running in StackBlitz
const isStackBlitz = typeof window !== 'undefined' && window?.location?.hostname?.includes('stackblitz');

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Don't show install prompts in StackBlitz
    if (isStackBlitz) {
      setShowInstallPrompt(false);
      return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      return;
    }

    // Check if it's an iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsIOS(isIOSDevice && isSafari);

    // Show prompt for iOS Safari
    if (isIOSDevice && isSafari) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      setShowInstallPrompt(!dismissed);
      return;
    }

    // Handle beforeinstallprompt event for other browsers
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      setShowInstallPrompt(!dismissed);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if installed status changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
      if (e.matches) {
        setShowInstallPrompt(false);
      }
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const hideInstallPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  return {
    isInstallable: (!isInstalled && !isStackBlitz && (isIOS || !!deferredPrompt)),
    showInstallPrompt,
    installApp,
    hideInstallPrompt,
    isIOS
  };
};