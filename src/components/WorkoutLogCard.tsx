import React, { useState } from 'react';
import { Calendar, Clock, MoreVertical, Trash2, Medal } from 'lucide-react';
import { WorkoutLog } from '../types/workout';
import { useSettings } from '../context/SettingsContext';
import { ExerciseSetList } from './ExerciseSetList';

interface WorkoutLogCardProps {
  log: WorkoutLog;
  onDelete: () => void;
}

export const WorkoutLogCard: React.FC<WorkoutLogCardProps> = ({ log, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const totalPRs = log.exercises.reduce((total, { sets }) => 
    total + sets.filter(set => set.isPR).length, 0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <h3 className="text-lg font-bold text-gray-900">{log.name || 'Unnamed Workout'}</h3>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1.5" />
                {formatDate(log.startTime)}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1.5" />
                {formatDuration(log.duration)}
              </div>
              {totalPRs > 0 && (
                <div className="flex items-center text-yellow-600">
                  <Medal size={16} className="mr-1.5" />
                  {totalPRs} PR{totalPRs > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical size={20} className="text-gray-500" />
            </button>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                  <div
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center cursor-pointer"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Log
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Exercise Summary */}
        <div 
          className="flex flex-wrap gap-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {log.exercises.map(({ exercise }) => (
            <span
              key={exercise.id}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              {exercise.name}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t">
          {log.exercises.map(({ exercise, sets }) => (
            <ExerciseSetList
              key={exercise.id}
              exercise={exercise}
              sets={sets}
            />
          ))}
        </div>
      )}
    </div>
  );
};