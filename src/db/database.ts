import { openDB } from 'idb';
import { WorkoutLog } from '../types/workout';

const dbName = 'ssl-workout-tracker';
const dbVersion = 2; // Incrementing version for new store

export type WeightUnit = 'kgs' | 'lbs';

export interface UserSettings {
  id: string;
  weightUnit: WeightUnit;
}

const initDB = async () => {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db, oldVersion) {
      // Workouts store
      if (!db.objectStoreNames.contains('workouts')) {
        db.createObjectStore('workouts', { keyPath: 'id' });
      }
      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    },
  });
  return db;
};

// Workout functions
export const saveWorkout = async (workout: WorkoutLog) => {
  const db = await initDB();
  await db.put('workouts', workout);
};

export const getWorkouts = async (): Promise<WorkoutLog[]> => {
  const db = await initDB();
  const workouts = await db.getAll('workouts');
  return workouts.sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
};

export const searchWorkouts = async (query: string): Promise<WorkoutLog[]> => {
  const db = await initDB();
  const workouts = await db.getAll('workouts');
  const searchTerm = query.toLowerCase();
  
  return workouts
    .filter(workout => 
      workout.name.toLowerCase().includes(searchTerm) ||
      workout.exercises.some(({ exercise }) => 
        exercise.name.toLowerCase().includes(searchTerm)
      )
    )
    .sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
};

export const deleteWorkoutLog = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('workouts', id);
};

// Settings functions
export const saveSettings = async (userId: string, weightUnit: WeightUnit): Promise<void> => {
  const db = await initDB();
  await db.put('settings', { id: userId, weightUnit });
};

export const getSettings = async (userId: string): Promise<UserSettings | undefined> => {
  const db = await initDB();
  return db.get('settings', userId);
};