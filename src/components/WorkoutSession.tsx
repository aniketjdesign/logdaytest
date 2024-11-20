import React, { useState, useEffect } from 'react';
import { Timer, Plus, Trash2, Dumbbell, CheckCheck, X } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { ExerciseSelectionModal } from './ExerciseSelectionModal';
import { WorkoutReview } from './WorkoutReview';
import { ConfirmationModal } from './ConfirmationModal';
import { SetRow } from './SetRow';
import { MobileWorkoutView } from './MobileWorkoutView';
import { Exercise } from '../types/workout';
import { generateWorkoutName } from '../utils/workoutNameGenerator';

export const WorkoutSession: React.FC = () => {
  const { 
    currentWorkout, 
    updateWorkoutExercise, 
    completeWorkout,
    deleteExercise,
    addExercisesToWorkout,
    setCurrentWorkout,
    setSelectedExercises,
    clearWorkoutState 
  } = useWorkout();
  const { weightUnit } = useSettings();
  const [workoutName, setWorkoutName] = useState(currentWorkout?.name || '');
  const [duration, setDuration] = useState(0);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [completedWorkout, setCompletedWorkout] = useState(null);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentWorkout) {
      const generatedName = generateWorkoutName(currentWorkout.exercises.map(e => e.exercise));
      setWorkoutName(generatedName);
      setCurrentWorkout({
        ...currentWorkout,
        name: generatedName
      });
    }
  }, [currentWorkout?.exercises]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentWorkout?.startTime) {
        const elapsed = Math.floor((Date.now() - new Date(currentWorkout.startTime).getTime()) / 1000);
        setDuration(elapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentWorkout?.startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getIncompleteStats = () => {
    if (!currentWorkout) return { exercises: 0, sets: 0 };
    
    let incompleteSets = 0;
    currentWorkout.exercises.forEach(({ exercise, sets }) => {
      const isBodyweight = exercise.name.includes('(Bodyweight)');
      sets.forEach(set => {
        if (!set.performedReps || (!isBodyweight && !set.weight)) {
          incompleteSets++;
        }
      });
    });

    return {
      exercises: currentWorkout.exercises.length,
      sets: incompleteSets
    };
  };

  const handleCompleteWorkout = async () => {
    if (currentWorkout) {
      try {
        const completed = await completeWorkout(workoutName);
        setCompletedWorkout(completed);
        setShowFinishConfirmation(false);
      } catch (error) {
        console.error('Error completing workout:', error);
      }
    }
  };

  const handleCancelWorkout = () => {
    clearWorkoutState();
    navigate('/');
  };

  const handleAddSet = (exerciseId: string) => {
    const exercise = currentWorkout?.exercises.find(e => e.exercise.id === exerciseId);
    if (exercise) {
      const lastSet = exercise.sets.length > 0 
        ? exercise.sets[exercise.sets.length - 1]
        : { targetReps: 0, weight: 0 };

      const newSet = {
        id: Date.now().toString(),
        setNumber: exercise.sets.length + 1,
        targetReps: lastSet.targetReps,
        performedReps: '',
        weight: lastSet.weight,
        comments: '',
        isPR: false
      };
      updateWorkoutExercise(exerciseId, {
        ...exercise,
        sets: [...exercise.sets, newSet]
      });
    }
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    const exercise = currentWorkout?.exercises.find(e => e.exercise.id === exerciseId);
    if (exercise) {
      const updatedSets = exercise.sets.filter(set => set.id !== setId);
      const renumberedSets = updatedSets.map((set, index) => ({
        ...set,
        setNumber: index + 1
      }));
      updateWorkoutExercise(exerciseId, {
        ...exercise,
        sets: renumberedSets
      });
    }
  };

  const handleUpdateSet = (exerciseId: string, setId: string, field: string, value: any) => {
    if (!currentWorkout) return;
    const exercise = currentWorkout.exercises.find(e => e.exercise.id === exerciseId);
    if (exercise) {
      let processedValue = value;
      
      if (field === 'weight' || field === 'targetReps') {
        processedValue = Math.max(0, value);
        if (field === 'weight') {
          processedValue = Math.round(parseFloat(processedValue) * 4) / 4;
        }
        if (isNaN(processedValue)) processedValue = 0;
      }

      const updatedSets = exercise.sets.map(set =>
        set.id === setId ? { ...set, [field]: processedValue } : set
      );
      updateWorkoutExercise(exerciseId, {
        ...exercise,
        sets: updatedSets
      });
    }
  };

  const handleAddExercises = (selectedExercises: Exercise[]) => {
    addExercisesToWorkout(selectedExercises);
    setShowExerciseModal(false);
  };

  // Mobile View
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    if (!currentWorkout) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Dumbbell className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No active workout</h3>
            <p className="text-gray-500 mb-6">Select exercises to start your workout session</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Select Exercises
            </button>
          </div>
        </div>
      );
    }

    return (
      <MobileWorkoutView
        workout={currentWorkout}
        duration={duration}
        workoutName={workoutName}
        onNameChange={setWorkoutName}
        onUpdateSet={handleUpdateSet}
        onDeleteSet={handleDeleteSet}
        onAddSet={handleAddSet}
        onDeleteExercise={deleteExercise}
        onShowExerciseModal={handleAddExercises}
        onCompleteWorkout={handleCompleteWorkout}
        onCancelWorkout={handleCancelWorkout}
      />
    );
  }

  // Desktop View
  if (!currentWorkout && !completedWorkout) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Dumbbell className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No active workout</h3>
          <p className="text-gray-500 mb-6">Select exercises to start your workout session</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Select Exercises
          </button>
        </div>
      </div>
    );
  }

  if (completedWorkout) {
    return (
      <WorkoutReview
        workout={completedWorkout}
        onClose={() => {
          setCompletedWorkout(null);
          navigate('/');
        }}
      />
    );
  }

  const { exercises: exerciseCount, sets: incompleteSets } = getIncompleteStats();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Timer size={24} className="text-gray-500" />
            <span className="text-2xl font-bold">{formatTime(duration)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowExerciseModal(true)}
              className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
            >
              <Plus size={18} className="mr-2" />
              Add Exercise
            </button>
            <button
              onClick={() => setShowFinishConfirmation(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm"
            >
              <CheckCheck size={18} />
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Workout Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
        />
      </div>

      {currentWorkout.exercises.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <Dumbbell className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No exercises in your workout</h3>
          <p className="text-gray-500 mb-6">Add some exercises to continue your workout</p>
          <button
            onClick={() => setShowExerciseModal(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Add Exercises
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-6">
            {currentWorkout.exercises.map(({ exercise, sets }) => {
              const isBodyweight = exercise.name.includes('(Bodyweight)');
              const isCardio = exercise.muscleGroup === 'Cardio';
              const isTimeBasedCore = exercise.muscleGroup === 'Core' && exercise.metrics?.time;

              return (
                <div key={exercise.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{exercise.name}</h3>
                    <button
                      onClick={() => deleteExercise(exercise.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="hidden md:grid md:grid-cols-[35px_1fr_1fr_1fr_1.2fr_100px] gap-2 mb-2 text-xs font-medium text-gray-500">
                      <div className="text-center">SET</div>
                      {isCardio || isTimeBasedCore ? (
                        <>
                          <div>TIME</div>
                          {exercise.metrics?.distance && <div>DISTANCE</div>}
                          {exercise.metrics?.difficulty && <div>DIFFICULTY</div>}
                          {exercise.metrics?.incline && <div>INCLINE</div>}
                          {exercise.metrics?.pace && <div>PACE</div>}
                          {exercise.metrics?.reps && <div>REPS</div>}
                        </>
                      ) : (
                        <>
                          <div>{isBodyweight ? 'WEIGHT' : weightUnit.toUpperCase()}</div>
                          <div>GOAL</div>
                          <div>DONE</div>
                        </>
                      )}
                      <div>NOTES</div>
                      <div>ACTIONS</div>
                    </div>

                    {sets.map(set => (
                      <SetRow
                        key={set.id}
                        set={set}
                        exercise={exercise}
                        onUpdate={(field, value) => handleUpdateSet(exercise.id, set.id, field, value)}
                        onDelete={() => handleDeleteSet(exercise.id, set.id)}
                      />
                    ))}
                    <button
                      onClick={() => handleAddSet(exercise.id)}
                      className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Set
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 mb-6">
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
        </>
      )}

      {showExerciseModal && (
        <ExerciseSelectionModal
          onClose={() => setShowExerciseModal(false)}
          onAdd={handleAddExercises}
          currentExercises={currentWorkout.exercises.map(e => e.exercise)}
        />
      )}

      <ConfirmationModal
        isOpen={showFinishConfirmation}
        onClose={() => setShowFinishConfirmation(false)}
        onConfirm={handleCompleteWorkout}
        title="Finish Workout?"
        message={`You have ${exerciseCount} exercises with ${incompleteSets} incomplete sets. Are you sure you want to finish this workout?`}
        confirmText="Yes, Finish"
        confirmButtonClass="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationModal
        isOpen={showCancelConfirmation}
        onClose={() => setShowCancelConfirmation(false)}
        onConfirm={handleCancelWorkout}
        title="Cancel Workout?"
        message={`You have ${exerciseCount} exercises with ${incompleteSets} sets that will be discarded. This action cannot be undone.`}
        confirmText="Yes, Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};