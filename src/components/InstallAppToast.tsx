import React from 'react';
import { X, Share } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export const InstallAppToast: React.FC = () => {
  const { showInstallPrompt, hideInstallPrompt, isInstallable, isIOS } = useInstallPrompt();

  if (!isInstallable || !showInstallPrompt) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-100 mb-4">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-blue-800 font-semibold mb-2">To install Logday:</h3>
            <div className="space-y-2">
              <div className="flex items-center text-blue-600">
                <Share className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">1. Tap the share button</p>
              </div>
              <p className="text-sm text-blue-600 ml-7">2. Scroll down and tap "Add to Home Screen"</p>
            </div>
          </div>
          <button
            onClick={hideInstallPrompt}
            className="text-blue-600 hover:text-blue-700 p-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};