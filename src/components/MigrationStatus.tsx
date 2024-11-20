import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useMigration } from '../hooks/useMigration';

export const MigrationStatus: React.FC = () => {
  const { isMigrating, migrationError, migrationComplete } = useMigration();
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isMigrating || migrationError || migrationComplete) {
      setShow(true);
      
      // If migration is complete, start fade out after 3 seconds
      if (migrationComplete) {
        const timer = setTimeout(() => {
          setFadeOut(true);
          // Hide component after fade out animation
          setTimeout(() => setShow(false), 300);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isMigrating, migrationError, migrationComplete]);

  if (!show) return null;

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg p-4 transition-opacity duration-300 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      {isMigrating ? (
        <div className="flex items-center space-x-3">
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          <p className="text-sm text-gray-600">
            Migrating your workout data...
          </p>
        </div>
      ) : migrationError ? (
        <div className="flex items-center space-x-3 text-red-600">
          <XCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Error migrating data. Your data is safe and will be migrated next time you log in.
          </p>
        </div>
      ) : migrationComplete ? (
        <div className="flex items-center space-x-3 text-green-600">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Data migration completed successfully!
          </p>
        </div>
      ) : null}
    </div>
  );
};