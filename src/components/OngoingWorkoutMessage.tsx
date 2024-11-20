import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OngoingWorkoutMessage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:flex sm:items-center sm:justify-between">
      <div className="flex items-center mb-3 sm:mb-0">
        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
        <span className="text-yellow-700 text-sm sm:text-base">You have an ongoing workout</span>
      </div>
      <button
        onClick={() => navigate('/workout')}
        className="w-full sm:w-auto px-4 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium flex items-center justify-center sm:justify-start transition-colors"
      >
        <ArrowLeft size={16} className="mr-1.5" />
        Return to Workout
      </button>
    </div>
  );
};