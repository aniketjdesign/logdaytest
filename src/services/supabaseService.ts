import { supabase } from '../config/supabase';
import { WorkoutLog } from '../types/workout';
import { WeightUnit } from '../db/database';
import { isValidUUID } from '../utils/uuid';

const ITEMS_PER_PAGE = 10;

export const supabaseService = {
  async getWorkoutLogs(page: number = 1) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No authenticated user');

      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('workout_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      // Transform and validate the data
      const transformedData = data?.map(log => ({
        id: log.id,
        name: log.name,
        exercises: log.exercises,
        startTime: log.start_time,
        endTime: log.end_time,
        duration: log.duration
      })) || [];

      return { data: transformedData, count: count || 0, error: null };
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      return { data: [], count: 0, error };
    }
  },

  async saveWorkoutLog(workout: WorkoutLog) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No authenticated user');

      // Validate UUID format
      if (!isValidUUID(workout.id)) {
        throw new Error('Invalid UUID format');
      }

      const workoutData = {
        id: workout.id,
        user_id: session.user.id,
        name: workout.name || 'Untitled Workout',
        exercises: workout.exercises,
        start_time: workout.startTime,
        end_time: workout.endTime,
        duration: workout.duration,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('workout_logs')
        .upsert([workoutData]);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error saving workout log:', error);
      return { error };
    }
  },

  async deleteWorkoutLog(logId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No authenticated user');

      // Validate UUID format
      if (!isValidUUID(logId)) {
        throw new Error('Invalid UUID format');
      }

      const { error } = await supabase
        .from('workout_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error deleting workout log:', error);
      return { error };
    }
  },

  async searchWorkoutLogs(query: string, page: number = 1) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No authenticated user');

      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let queryBuilder = supabase
        .from('workout_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);

      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,exercises.ilike.%${query}%`);
      }

      const { data, error, count } = await queryBuilder
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      // Transform and validate the data
      const transformedData = data?.map(log => ({
        id: log.id,
        name: log.name,
        exercises: log.exercises,
        startTime: log.start_time,
        endTime: log.end_time,
        duration: log.duration
      })) || [];

      return { data: transformedData, count: count || 0, error: null };
    } catch (error) {
      console.error('Error searching workout logs:', error);
      return { data: [], count: 0, error };
    }
  },

  async getUserSettings() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('user_settings')
        .select('weight_unit')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      return { weightUnit: (data?.weight_unit || 'lbs') as WeightUnit, error: null };
    } catch (error) {
      console.error('Error fetching user settings:', error);
      return { weightUnit: 'lbs' as WeightUnit, error };
    }
  },

  async saveUserSettings(weightUnit: WeightUnit) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          weight_unit: weightUnit,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error saving user settings:', error);
      return { error };
    }
  },

  async migrateLocalStorage() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No authenticated user');

      // Get data from localStorage
      const STORAGE_PREFIX = 'logday_';
      const workoutLogs = localStorage.getItem(`${STORAGE_PREFIX}workoutLogs`);
      const weightUnit = localStorage.getItem(`${STORAGE_PREFIX}weightUnit`);

      const migrationPromises = [];

      if (workoutLogs) {
        try {
          const logs = JSON.parse(workoutLogs);
          if (Array.isArray(logs)) {
            migrationPromises.push(
              ...logs.map(log => {
                // Ensure valid UUID for migrated logs
                const validLog = {
                  ...log,
                  id: isValidUUID(log.id) ? log.id : crypto.randomUUID()
                };
                return this.saveWorkoutLog(validLog);
              })
            );
          }
        } catch (e) {
          console.error('Error parsing workout logs:', e);
        }
      }

      if (weightUnit) {
        if (weightUnit === 'kgs' || weightUnit === 'lbs') {
          migrationPromises.push(
            this.saveUserSettings(weightUnit as WeightUnit)
          );
        }
      }

      await Promise.all(migrationPromises);

      // Clear migrated data
      localStorage.removeItem(`${STORAGE_PREFIX}workoutLogs`);
      localStorage.removeItem(`${STORAGE_PREFIX}weightUnit`);

      return { error: null };
    } catch (error) {
      console.error('Error migrating localStorage data:', error);
      return { error };
    }
  }
};