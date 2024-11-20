import React from 'react';
import { Dumbbell, ArrowLeft, Plus } from 'lucide-react';
import { WorkoutLog } from '../types/workout';

interface EmptyStateProps {
  currentWorkout: WorkoutLog | null;
  onNavigate: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ currentWorkout, onNavigate }) => {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="flex justify-center mb-4">
        <Dumbbell className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
        {currentWorkout 
          ? "Complete Your Workout to See Logs"
          : "No workout logs yet"}
      </h3>
      <p className="text-sm sm:text-base text-gray-500 mb-6">
        {currentWorkout 
          ? "Your workout logs will appear here once you finish your current workout"
          : "Start your fitness journey by logging your first workout"}
      </p>
      <button
        onClick={onNavigate}
        className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        {currentWorkout ? (
          <>
            <ArrowLeft size={18} className="mr-1.5 sm:mr-2" />
            Return to Workout
          </>
        ) : (
          <>
            <Plus size={18} className="mr-1.5 sm:mr-2" />
            Start Your First Workout
          </>
        )}
      </button>
    </div>
  );
};