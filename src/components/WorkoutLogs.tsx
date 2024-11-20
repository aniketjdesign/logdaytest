import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Dumbbell, MoreVertical, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from './ConfirmationModal';
import { OngoingWorkoutMessage } from './OngoingWorkoutMessage';
import { WorkoutLogCard } from './WorkoutLogCard';
import { EmptyState } from './EmptyState';

export const WorkoutLogs: React.FC = () => {
  const { workoutLogs, searchLogs, deleteLog, currentWorkout } = useWorkout();
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLogs = async () => {
      await searchLogs(search);
      setIsLoading(false);
    };
    loadLogs();
  }, [search]);

  const handleDeleteClick = (logId: string) => {
    setSelectedLogId(logId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedLogId) {
      await deleteLog(selectedLogId);
      setShowDeleteModal(false);
      setSelectedLogId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Workout History</h1>
        <p className="text-sm text-gray-600 mb-4">View your past workouts</p>
        
        {currentWorkout && <OngoingWorkoutMessage />}
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (workoutLogs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Workout History</h1>
        <p className="text-sm text-gray-600 mb-4">View your past workouts</p>

        {currentWorkout && <OngoingWorkoutMessage />}
        <EmptyState
          currentWorkout={currentWorkout}
          onNavigate={() => navigate(currentWorkout ? '/workout' : '/')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {currentWorkout && <OngoingWorkoutMessage />}

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Workout History</h1>
        <p className="text-sm text-gray-600 mb-4">View your past workouts</p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search workouts..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {workoutLogs.map(log => (
          <WorkoutLogCard
            key={log.id}
            log={log}
            onDelete={() => handleDeleteClick(log.id)}
          />
        ))}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Workout Log?"
        message="This action cannot be undone. Are you sure you want to delete this workout log?"
        confirmText="Delete Log"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};