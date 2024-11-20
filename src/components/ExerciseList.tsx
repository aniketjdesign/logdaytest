import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, ArrowLeft } from 'lucide-react';
import { Exercise, MuscleGroup } from '../types/workout';
import { exercises } from '../data/exercises';
import { useWorkout } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import { generateWorkoutName } from '../utils/workoutNameGenerator';
import { OngoingWorkoutMessage } from './OngoingWorkoutMessage';
import { InstallAppToast } from './InstallAppToast';

export const ExerciseList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'All'>('All');
  const navigate = useNavigate();
  const { selectedExercises, setSelectedExercises, currentWorkout, startWorkout } = useWorkout();

  const muscleGroups: ('All' | MuscleGroup)[] = [
    'All',
    'Chest',
    'Back',
    'Shoulders',
    'Quads',
    'Hamstrings',
    'Triceps',
    'Biceps',
    'Glutes',
    'Calves',
    'Core',
    'Cardio'
  ];

  const filteredExercises = useMemo(() => {
    const searchTerms = search.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return exercises.filter(exercise => {
      const matchesSearch = searchTerms.length === 0 || searchTerms.every(term =>
        exercise.name.toLowerCase().includes(term) ||
        exercise.muscleGroup.toLowerCase().includes(term)
      );
      const matchesMuscleGroup = selectedMuscleGroup === 'All' || exercise.muscleGroup === selectedMuscleGroup;
      return matchesSearch && matchesMuscleGroup;
    });
  }, [search, selectedMuscleGroup]);

  const handleStartWorkout = () => {
    if (selectedExercises.length > 0 && !currentWorkout) {
      const workoutName = generateWorkoutName(selectedExercises);
      startWorkout(selectedExercises, workoutName);
      navigate('/workout');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {currentWorkout && <OngoingWorkoutMessage />}
      <InstallAppToast />

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Quick Start</h1>
        <p className="text-sm text-gray-600 mb-4">Select or search exercises and click Start Workout</p>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search exercises..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleStartWorkout}
            disabled={selectedExercises.length === 0 || currentWorkout}
            className={`inline-flex items-center px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap justify-center sm:justify-start ${
              selectedExercises.length === 0 || currentWorkout
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Plus size={20} className="mr-1.5" />
            <span className="text-sm">
              Start Workout ({selectedExercises.length})
            </span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin mt-4">
          <Filter size={18} className="text-gray-500 flex-shrink-0" />
          {muscleGroups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedMuscleGroup(group)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors
                ${selectedMuscleGroup === group
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredExercises.map(exercise => (
          <div
            key={exercise.id}
            onClick={() => {
              if (!currentWorkout) {
                setSelectedExercises(
                  selectedExercises.find(e => e.id === exercise.id)
                    ? selectedExercises.filter(e => e.id !== exercise.id)
                    : [...selectedExercises, exercise]
                );
              }
            }}
            className={`p-4 rounded-lg transition-all ${
              currentWorkout 
                ? 'opacity-50 cursor-not-allowed'
                : selectedExercises.find(e => e.id === exercise.id)
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-white border border-gray-200 hover:border-blue-300'
            }`}
          >
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{exercise.name}</h3>
            <span className="text-xs sm:text-sm text-gray-500">{exercise.muscleGroup}</span>
          </div>
        ))}
      </div>
    </div>
  );
};