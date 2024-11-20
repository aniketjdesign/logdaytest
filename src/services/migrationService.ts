import { supabaseService } from './supabaseService';
import { WorkoutLog } from '../types/workout';
import { generateUUID } from '../utils/uuid';

const MIGRATION_VERSION_KEY = 'logday_migration_version';
const CURRENT_MIGRATION_VERSION = 1;
const STORAGE_PREFIX = 'logday_';

export const migrationService = {
  async shouldMigrate(): Promise<boolean> {
    try {
      // Get all localStorage data
      const workoutLogs = localStorage.getItem(`${STORAGE_PREFIX}workoutLogs`);
      const weightUnit = localStorage.getItem(`${STORAGE_PREFIX}weightUnit`);
      const lastMigration = localStorage.getItem(MIGRATION_VERSION_KEY);
      const currentWorkout = localStorage.getItem(`${STORAGE_PREFIX}currentWorkout`);

      // Parse workout logs to check if there's valid data
      let hasValidWorkoutLogs = false;
      if (workoutLogs) {
        try {
          const logs = JSON.parse(workoutLogs);
          hasValidWorkoutLogs = Array.isArray(logs) && logs.length > 0;
          console.log(`Found ${logs.length} workout logs to migrate`);
        } catch (e) {
          console.error('Invalid workout logs format:', e);
        }
      }

      const shouldMigrate = (hasValidWorkoutLogs || !!weightUnit) && 
                          (!lastMigration || parseInt(lastMigration) < CURRENT_MIGRATION_VERSION) &&
                          !currentWorkout; // Don't migrate if there's an active workout

      console.log('Migration check:', {
        hasValidWorkoutLogs,
        hasWeightUnit: !!weightUnit,
        lastMigration,
        currentVersion: CURRENT_MIGRATION_VERSION,
        shouldMigrate
      });

      return shouldMigrate;
    } catch (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
  },

  async migrateData(): Promise<{ success: boolean; error?: Error }> {
    try {
      console.log('Starting migration process...');

      // Get workout logs
      const workoutLogsData = localStorage.getItem(`${STORAGE_PREFIX}workoutLogs`);
      let migratedLogsCount = 0;

      if (workoutLogsData) {
        try {
          const logs: WorkoutLog[] = JSON.parse(workoutLogsData);
          console.log(`Found ${logs.length} logs to migrate`);

          // Process logs in sequence to maintain order
          for (const log of logs) {
            // Skip invalid logs
            if (!log.startTime || !log.endTime || !log.exercises) {
              console.warn('Skipping invalid log:', log);
              continue;
            }

            // Ensure valid UUIDs for all IDs
            const validLog = {
              ...log,
              id: generateUUID(),
              exercises: log.exercises.map(ex => ({
                ...ex,
                sets: ex.sets.map(set => ({
                  ...set,
                  id: generateUUID()
                }))
              }))
            };

            const { error } = await supabaseService.saveWorkoutLog(validLog);
            if (error) {
              console.error('Failed to migrate log:', error);
              throw error;
            }
            migratedLogsCount++;
            console.log(`Successfully migrated log ${migratedLogsCount}/${logs.length}`);
          }
        } catch (e) {
          console.error('Error processing workout logs:', e);
          throw e;
        }
      }

      // Migrate weight unit preference
      const weightUnit = localStorage.getItem(`${STORAGE_PREFIX}weightUnit`);
      if (weightUnit && (weightUnit === 'kgs' || weightUnit === 'lbs')) {
        console.log('Migrating weight unit setting:', weightUnit);
        const { error } = await supabaseService.saveUserSettings(weightUnit);
        if (error) {
          console.error('Failed to migrate weight unit:', error);
          throw error;
        }
      }

      // Only mark migration as complete if we successfully migrated everything
      localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_MIGRATION_VERSION.toString());
      console.log(`Migration completed: ${migratedLogsCount} logs migrated`);

      // Clear migrated data
      if (workoutLogsData) localStorage.removeItem(`${STORAGE_PREFIX}workoutLogs`);
      if (weightUnit) localStorage.removeItem(`${STORAGE_PREFIX}weightUnit`);

      return { success: true };
    } catch (error) {
      console.error('Migration failed:', error);
      // Don't clear data if migration failed
      return { success: false, error: error as Error };
    }
  }
};