import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { migrationService } from '../services/migrationService';

export const useMigration = () => {
  const { user } = useAuth();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationError, setMigrationError] = useState<Error | null>(null);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkAndMigrate = async () => {
      if (!user) return;

      try {
        const shouldMigrate = await migrationService.shouldMigrate();
        console.log('Should migrate data?', shouldMigrate);
        
        if (shouldMigrate) {
          setIsMigrating(true);
          setMigrationError(null);

          const { success, error } = await migrationService.migrateData();
          
          if (!success) {
            console.error('Migration failed:', error);
            setMigrationError(error || new Error('Migration failed'));
            
            // Retry migration if it failed (max 3 attempts)
            if (retryCount < 3) {
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
              }, 2000); // Wait 2 seconds before retrying
            }
          } else {
            console.log('Migration completed successfully');
            setMigrationComplete(true);
            setRetryCount(0);
          }
        }
      } catch (error) {
        console.error('Migration error:', error);
        setMigrationError(error as Error);
      } finally {
        setIsMigrating(false);
      }
    };

    checkAndMigrate();
  }, [user, retryCount]);

  return { isMigrating, migrationError, migrationComplete };
};