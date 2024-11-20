import React, { useState, useRef } from 'react';
import { Plus, Timer, MoreVertical, Trash2, CheckCheck, History, Settings, X, RefreshCw, Pause, Play } from 'lucide-react';
import { WorkoutLog, Exercise } from '../types/workout';
import { MobileSetRow } from './MobileSetRow';
import { AddNoteModal } from './AddNoteModal';
import { ConfirmationModal } from './ConfirmationModal';
import { ExerciseSelectionModal } from './ExerciseSelectionModal';
import { WorkoutReview } from './WorkoutReview';
import { CircularProgress } from './CircularProgress';
import { useWorkout } from '../context/WorkoutContext';
import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';

interface MobileWorkoutViewProps {
  workout: WorkoutLog;
  duration: number;
  workoutName: string;
  onNameChange: (name: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: string, value: any) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onAddSet: (exerciseId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onShowExerciseModal: (exercises: Exercise[]) => void;
  onCompleteWorkout: () => void;
  onCancelWorkout: () => void;
}

export const MobileWorkoutView: React.FC<MobileWorkoutViewProps> = ({
  workout,
  duration,
  workoutName,
  onNameChange,
  onUpdateSet,
  onDeleteSet,
  onAddSet,
  onDeleteExercise,
  onShowExerciseModal,
  onCompleteWorkout,
  onCancelWorkout,
}) => {
  const [activeNoteModal, setActiveNoteModal] = useState<{
    exerciseId: string;
    setId: string;
    exerciseName: string;
    setNumber: number;
  } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showWorkoutReview, setShowWorkoutReview] = useState(false);
  const [completedWorkout, setCompletedWorkout] = useState<WorkoutLog | null>(null);
  const { clearWorkoutState, searchLogs } = useWorkout();
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWorkoutStats = () => {
    const totalExercises = workout.exercises.length;
    const completedExercises = workout.exercises.filter(({ sets }) => 
      sets.some(set => set.performedReps || set.time)
    ).length;

    const totalSets = workout.exercises.reduce((total, { sets }) => total + sets.length, 0);
    const completedSets = workout.exercises.reduce((total, { sets }) => 
      total + sets.filter(set => set.performedReps || set.time).length, 0
    );

    const exerciseProgress = (completedExercises / totalExercises) * 100;
    const setProgress = (completedSets / totalSets) * 100;

    return {
      exercises: {
        completed: completedExercises,
        total: totalExercises,
        progress: exerciseProgress,
        color: exerciseProgress >= 70 ? '#22C55E' : '#EAB308'
      },
      sets: {
        completed: completedSets,
        total: totalSets,
        progress: setProgress,
        color: setProgress >= 70 ? '#22C55E' : '#EAB308'
      }
    };
  };

  const handleAddExercises = (selectedExercises: Exercise[]) => {
    onShowExerciseModal(selectedExercises);
    setShowExerciseModal(false);
  };

  const handleCompleteWorkout = () => {
    setShowFinishConfirmation(false);
    const endTime = new Date().toISOString();
    const completedWorkoutData = {
      ...workout,
      name: workoutName,
      endTime,
      duration: new Date(endTime).getTime() - new Date(workout.startTime).getTime()
    };
    setCompletedWorkout(completedWorkoutData);
    setShowWorkoutReview(true);
  };

  const handleCloseReview = async () => {
    setShowWorkoutReview(false);
    setCompletedWorkout(null);
    clearWorkoutState();
    await searchLogs('');
    onCompleteWorkout();
  };

  const handleCancelWorkout = () => {
    setShowCancelConfirmation(false);
    clearWorkoutState();
    onCancelWorkout();
  };

  const stats = getWorkoutStats();

  if (showWorkoutReview && completedWorkout) {
    return (
      <WorkoutReview
        workout={completedWorkout}
        onClose={handleCloseReview}
      />
    );
  }

  const exerciseRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  const scrollToExercise = (exerciseId: string) => {
    const element = exerciseRefs.current[exerciseId];
    if (element) {
      // Add a small delay to ensure UI updates are complete
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const [isPaused, setIsPaused] = useState(false);
  const [lastPausedTime, setLastPausedTime] = useState<number | null>(null);
  
  const handlePauseResume = () => {
    if (isPaused) {
      // Resume: Add the paused duration to workout start time
      if (lastPausedTime) {
        const pausedDuration = Date.now() - lastPausedTime;
        workout.startTime = new Date(new Date(workout.startTime).getTime() + pausedDuration).toISOString();
      }
    } else {
      // Pause: Store the current time
      setLastPausedTime(Date.now());
    }
    setIsPaused(!isPaused);
    setShowMenu(false);
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="md:hidden min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-40">
        {/* First Row - Workout Name and Actions */}
        <div className="flex items-center justify-between p-4 gap-4">
          <input
            type="text"
            placeholder="Workout Name"
            className="flex-1 px-2 py-1 text-md font-medium bg-transparent rounded-lg border text-gray-800"
            value={workoutName}
            onChange={(e) => onNameChange(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMenu(true)}
              className="p-2.5 bg-blue-50 rounded-lg"
            >
              <MoreVertical size={16} className="text-blue-600"/>
            </button>
            <button
              onClick={() => setShowExerciseModal(true)}
              className="p-2.5 bg-blue-600 text-white rounded-lg"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Second Row - Stats */}
        <div className="flex items-center justify-between px-4 pt-2 pb-4">
 
          <div className="flex w-1/4 items-center space-x-1">
          <Timer size={18} className={`${isPaused ? 'text-yellow-500' : 'text-gray-500'}`} />
             <span className={`text-sm font-medium ${isPaused ? 'text-yellow-600' : 'text-gray-600'}`}>
          {formatTime(duration)}
          {isPaused && ' (Paused)'}
        </span>
      </div>
      
          <div className="separator w-px h-4 bg-gray-200"/>
            <div className="flex items-center space-x-2">
              <CircularProgress 
                progress={stats.exercises.progress} 
                color={stats.exercises.color}
              />
              <span className="text-sm font-medium text-gray-600">
                {stats.exercises.completed}/{stats.exercises.total} exercises
              </span>
            </div>
          <div className="separator w-px h-4 bg-gray-200"/>
            <div className="flex items-center space-x-2">
              <CircularProgress 
                progress={stats.sets.progress} 
                color={stats.sets.color}
              />
              <span className="text-sm font-medium text-gray-600">
                {stats.sets.completed}/{stats.sets.total} sets
              </span>
            </div>
          </div>
        </div>


      {/* Exercise List */}
      <div className="mt-32 px-4 space-y-6 pb-32">
        {workout.exercises.map(({ exercise, sets }) => (
          <div 
            key={exercise.id} 
            ref={el => {
              if (el) exerciseRefs.current[exercise.id] = el;
            }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">{exercise.name}</h3>
              <button
                onClick={() => onDeleteExercise(exercise.id)}
                className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="p-4">
              {sets.map((set) => (
                <MobileSetRow
                  key={set.id}
                  set={set}
                  exercise={exercise}
                  onUpdate={(field, value) => onUpdateSet(exercise.id, set.id, field, value)}
                  onDelete={() => onDeleteSet(exercise.id, set.id)}
                  onOpenNoteModal={() => setActiveNoteModal({
                    exerciseId: exercise.id,
                    setId: set.id,
                    exerciseName: exercise.name,
                    setNumber: set.setNumber
                  })}
                />
              ))}
              <button
                onClick={() => onAddSet(exercise.id)}
                className="mt-3 flex items-center px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm justify-center"
              >
                <Plus size={16} className="mr-2" />
                Add Set
              </button>
            </div>
          </div>
        ))}

        {/* Bottom Action Buttons */}
        <div className="">
          <div className="space-y-3">
            <button
              onClick={() => setShowFinishConfirmation(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center"
            >
              <CheckCheck size={20} className="mr-2" />
              Finish Workout
            </button>
            <button
              onClick={() => setShowCancelConfirmation(true)}
              className="w-full py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors flex items-center justify-center"
            >
              <X size={20} className="mr-2" />
              Cancel Workout
            </button>
          </div>
        </div>
      </div>

     {/* Update the menu popover */}
{showMenu && (
  <>
    <div 
      className="fixed inset-0 z-50" 
      onClick={() => setShowMenu(false)}
    />
    <div className="fixed top-16 right-4 bg-white rounded-lg shadow-lg z-50 min-w-[200px] py-1">
      <button
        onClick={() => {
          setShowMenu(false);
          setShowFinishConfirmation(true);
        }}
        className="w-full flex items-center px-4 py-3 hover:bg-gray-50"
      >
        <CheckCheck size={18} className="mr-3 text-blue-600" />
        <span className="text-sm font-medium text-blue-600">Finish Workout</span>
      </button>
      <div className="w-full h-px bg-gray-100"/>
      <button
        onClick={handlePauseResume}
        className="w-full flex items-center px-4 py-3 hover:bg-gray-50"
      >
        {isPaused ? (
          <>
            <Play size={18} className="mr-3 text-green-600" />
            <span className="text-sm font-medium text-green-600">Resume Timer</span>
          </>
        ) : (
          <>
            <Pause size={18} className="mr-3 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-600">Pause Timer</span>
          </>
        )}
      </button>
      <button
        onClick={handleRefresh}
        className="w-full flex items-center px-4 py-3 hover:bg-gray-50"
      >
        <RefreshCw size={18} className="mr-3 text-gray-600" />
        <span className="text-sm font-medium">Refresh</span>
      </button>
      <div className="w-full h-px bg-gray-100"/>
      <button
        onClick={() => {
          setShowMenu(false);
          navigate('/logs');
        }}
        className="w-full flex items-center px-4 py-3 hover:bg-gray-50"
      >
        <History size={18} className="mr-3 text-gray-600" />
        <span className="text-sm font-medium">Workout History</span>
      </button>
      <button
        onClick={() => {
          setShowMenu(false);
          navigate('/settings');
        }}
        className="w-full flex items-center px-4 py-3 hover:bg-gray-50"
      >
        <Settings size={18} className="mr-3 text-gray-600" />
        <span className="text-sm font-medium">Settings</span>
      </button>
    </div>
  </>
)}

      {/* Other Modals */}
      {activeNoteModal && (
        <AddNoteModal
          exerciseName={activeNoteModal.exerciseName}
          setNumber={activeNoteModal.setNumber}
          currentNote={
            workout.exercises
              .find(e => e.exercise.id === activeNoteModal.exerciseId)
              ?.sets.find(s => s.id === activeNoteModal.setId)
              ?.comments || ''
          }
          onSave={(note) => {
            onUpdateSet(activeNoteModal.exerciseId, activeNoteModal.setId, 'comments', note);
            setActiveNoteModal(null);
          }}
          onClose={() => setActiveNoteModal(null)}
        />
      )}

      {showExerciseModal && (
        <ExerciseSelectionModal
          onClose={() => setShowExerciseModal(false)}
          onAdd={handleAddExercises}
          currentExercises={workout.exercises.map(e => e.exercise)}
        />
      )}

      <ConfirmationModal
        isOpen={showFinishConfirmation}
        onClose={() => setShowFinishConfirmation(false)}
        onConfirm={handleCompleteWorkout}
        title="Finish Workout?"
        message={`You have ${stats.exercises.completed}/${stats.exercises.total} exercises and ${stats.sets.completed}/${stats.sets.total} sets completed. Are you sure you want to finish this workout?`}
        confirmText="Yes, Finish"
        confirmButtonClass="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationModal
        isOpen={showCancelConfirmation}
        onClose={() => setShowCancelConfirmation(false)}
        onConfirm={handleCancelWorkout}
        title="Cancel Workout?"
        message={`You have ${stats.exercises.completed}/${stats.exercises.total} exercises and ${stats.sets.completed}/${stats.sets.total} sets that will be discarded. This action cannot be undone.`}
        confirmText="Yes, Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};