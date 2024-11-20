import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exercise, WorkoutLog, WorkoutExercise } from '../types/workout';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from './AuthContext';
import { generateUUID } from '../utils/uuid';

type View = 'exercises' | 'workout' | 'logs';

interface WorkoutContextType {
  selectedExercises: Exercise[];
  currentWorkout: WorkoutLog | null;
  workoutLogs: WorkoutLog[];
  totalLogs: number;
  currentPage: number;
  currentView: View;
  setSelectedExercises: (exercises: Exercise[]) => void;
  setCurrentWorkout: (workout: WorkoutLog | null) => void;
  startWorkout: (exercises: Exercise[], name?: string) => void;
  completeWorkout: (name: string) => Promise<WorkoutLog>;
  updateWorkoutExercise: (exerciseId: string, data: WorkoutExercise) => void;
  addExercisesToWorkout: (exercises: Exercise[]) => void;
  deleteExercise: (exerciseId: string) => void;
  deleteLog: (logId: string) => void;
  setCurrentView: (view: View) => void;
  searchLogs: (query: string) => void;
  clearWorkoutState: () => void;
  setCurrentPage: (page: number) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_PREFIX = 'logday_';
const CURRENT_WORKOUT_KEY = `${STORAGE_PREFIX}currentWorkout`;

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutLog | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState<View>('exercises');
  const { user } = useAuth();

  // Load current workout from localStorage
  useEffect(() => {
    try {
      const savedWorkout = localStorage.getItem(CURRENT_WORKOUT_KEY);

      if (savedWorkout) {
        setCurrentWorkout(JSON.parse(savedWorkout));
      }
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
  }, []);

  // Save current workout to localStorage
  useEffect(() => {
    if (currentWorkout) {
      localStorage.setItem(CURRENT_WORKOUT_KEY, JSON.stringify(currentWorkout));
    }
  }, [currentWorkout]);

  // Load workout logs from Supabase
  useEffect(() => {
    const loadWorkouts = async () => {
      if (user) {
        const { data, count, error } = await supabaseService.getWorkoutLogs(currentPage);
        if (!error) {
          setWorkoutLogs(data);
          setTotalLogs(count);
        }
      }
    };
    loadWorkouts();
  }, [user, currentPage]);

  // Migrate localStorage data to Supabase
  useEffect(() => {
    const migrateData = async () => {
      if (user) {
        const { error } = await supabaseService.migrateLocalStorage();
        if (error) {
          console.error('Migration error:', error);
        }
      }
    };
    migrateData();
  }, [user]);

  const startWorkout = (exercises: Exercise[], name: string = '') => {
    const workout: WorkoutLog = {
      id: generateUUID(),
      name,
      exercises: exercises.map(exercise => ({
        exercise,
        sets: [{ 
          id: generateUUID(), 
          setNumber: 1, 
          targetReps: 0, 
          performedReps: '', 
          weight: 0, 
          comments: '', 
          isPR: false 
        }]
      })),
      startTime: new Date().toISOString(),
      endTime: '',
      duration: 0
    };
    setCurrentWorkout(workout);
    setCurrentView('workout');
  };

  const completeWorkout = async (name: string): Promise<WorkoutLog> => {
    if (!currentWorkout) {
      throw new Error('No active workout to complete');
    }

    const endTime = new Date().toISOString();
    const duration = new Date(endTime).getTime() - new Date(currentWorkout.startTime).getTime();
    
    const completedWorkout: WorkoutLog = {
      ...currentWorkout,
      name,
      endTime,
      duration
    };

    const { error } = await supabaseService.saveWorkoutLog(completedWorkout);
    if (error) {
      throw error;
    }

    // Refresh the logs
    const { data, count } = await supabaseService.getWorkoutLogs(1);
    setWorkoutLogs(data);
    setTotalLogs(count);
    setCurrentPage(1);
    
    // Clear current workout
    localStorage.removeItem(CURRENT_WORKOUT_KEY);
    setCurrentWorkout(null);
    setCurrentView('logs');

    return completedWorkout;
  };

  const updateWorkoutExercise = (exerciseId: string, data: WorkoutExercise) => {
    if (!currentWorkout) return;
    setCurrentWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => 
          ex.exercise.id === exerciseId ? data : ex
        )
      };
    });
  };

  const addExercisesToWorkout = (exercises: Exercise[]) => {
    if (!currentWorkout) return;
    setCurrentWorkout(prev => {
      if (!prev) return null;
      const newExercises = exercises.map(exercise => ({
        exercise,
        sets: [{ 
          id: generateUUID(),
          setNumber: 1, 
          targetReps: 0, 
          performedReps: '', 
          weight: 0, 
          comments: '', 
          isPR: false 
        }]
      }));
      return {
        ...prev,
        exercises: [...prev.exercises, ...newExercises]
      };
    });
  };

  const deleteExercise = (exerciseId: string) => {
    if (!currentWorkout) return;
    setCurrentWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.filter(ex => ex.exercise.id !== exerciseId)
      };
    });
  };

  const deleteLog = async (logId: string) => {
    const { error } = await supabaseService.deleteWorkoutLog(logId);
    if (!error) {
      // Refresh the logs
      const { data, count } = await supabaseService.getWorkoutLogs(currentPage);
      setWorkoutLogs(data);
      setTotalLogs(count);
    }
  };

  const searchLogs = async (query: string) => {
    const { data, count } = await supabaseService.searchWorkoutLogs(query, currentPage);
    setWorkoutLogs(data);
    setTotalLogs(count);
  };

  const clearWorkoutState = () => {
    setCurrentWorkout(null);
    setSelectedExercises([]);
    localStorage.removeItem(CURRENT_WORKOUT_KEY);
  };

  return (
    <WorkoutContext.Provider value={{
      selectedExercises,
      currentWorkout,
      workoutLogs,
      totalLogs,
      currentPage,
      currentView,
      setSelectedExercises,
      setCurrentWorkout,
      startWorkout,
      completeWorkout,
      updateWorkoutExercise,
      addExercisesToWorkout,
      deleteExercise,
      deleteLog,
      setCurrentView,
      searchLogs,
      clearWorkoutState,
      setCurrentPage
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};