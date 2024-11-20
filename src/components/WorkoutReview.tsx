import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, X, Medal, History, Plus } from 'lucide-react';
import { WorkoutLog } from '../types/workout';
import { useWorkout } from '../context/WorkoutContext';
import { useSettings } from '../context/SettingsContext';
import Lottie from 'lottie-react';
import confettiAnimation from '../assets/confetti.json';

interface WorkoutReviewProps {
  workout: WorkoutLog;
  onClose: () => void;
}

export const WorkoutReview: React.FC<WorkoutReviewProps> = ({ workout, onClose }) => {
  const navigate = useNavigate();
  const { clearWorkoutState, searchLogs } = useWorkout();
  const { weightUnit, convertWeight } = useSettings();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [animationSegment, setAnimationSegment] = useState<[number, number]>([0, 110]);

  // Calculate animation duration based on the JSON data
  const ANIMATION_DURATION = 110; // frames
  const TOTAL_PLAYS = 2;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isAnimationComplete) {
      timeout = setTimeout(() => {
        setAnimationSegment([0, ANIMATION_DURATION]);
        setIsAnimationComplete(true);
      }, (ANIMATION_DURATION / 60) * 1000 * TOTAL_PLAYS); // Convert frames to milliseconds
    }
    return () => clearTimeout(timeout);
  }, []);

  const calculateStats = () => {
    let totalWeight = 0;
    let totalSets = 0;
    let totalPRs = 0;
    let totalDistance = 0;
    let totalTime = 0;

    workout.exercises.forEach(({ exercise, sets }) => {
      const isBodyweight = exercise.name.includes('(Bodyweight)');
      const isCardio = exercise.muscleGroup === 'Cardio';

      sets.forEach(set => {
        if (isCardio) {
          if (set.distance) totalDistance += set.distance;
          if (set.time) {
            const [minutes = 0, seconds = 0] = set.time.split(':').map(Number);
            totalTime += minutes * 60 + seconds;
          }
        } else if (!isBodyweight && set.weight && set.performedReps) {
          const weight = weightUnit === 'lb' ? convertWeight(set.weight, 'kg', 'lb') : set.weight;
          totalWeight += weight * (parseInt(set.performedReps) || 0);
        }
        totalSets++;
        if (set.isPR) totalPRs++;
      });
    });

    return { totalWeight, totalSets, totalPRs, totalDistance, totalTime };
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const getBestSets = () => {
    const bestSets: { exerciseId: string; exerciseName: string; weight: number; reps: number }[] = [];

    workout.exercises.forEach(({ exercise, sets }) => {
      const isBodyweight = exercise.name.includes('(Bodyweight)');
      const isCardio = exercise.muscleGroup === 'Cardio';

      if (!isBodyweight && !isCardio) {
        const bestSet = sets.reduce((best, current) => {
          const currentWeight = current.weight || 0;
          const currentReps = parseInt(current.performedReps || '0');
          const bestWeight = best.weight || 0;
          const bestReps = parseInt(best.performedReps || '0');

          if (currentWeight * currentReps > bestWeight * bestReps) {
            return current;
          }
          return best;
        }, sets[0]);

        if (bestSet && bestSet.weight && bestSet.performedReps) {
          bestSets.push({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            weight: bestSet.weight,
            reps: parseInt(bestSet.performedReps)
          });
        }
      }
    });

    return bestSets;
  };

  const handleGoToLogs = async () => {
    clearWorkoutState();
    // Trigger a refresh of the logs before navigating
    await searchLogs('');
    onClose();
    navigate('/logs');
  };

  const handleStartNew = () => {
    clearWorkoutState();
    onClose();
    navigate('/');
  };

  const { totalWeight, totalSets, totalPRs, totalDistance, totalTime } = calculateStats();
  const duration = Math.floor((new Date(workout.endTime).getTime() - new Date(workout.startTime).getTime()) / 1000);
  const bestSets = getBestSets();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <div className="absolute inset-0 overflow-hidden">
          <Lottie
            animationData={confettiAnimation}
            loop={false}
            autoplay={true}
            segments={[animationSegment]}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: '-10%',
              transform: 'scale(2)',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl max-w-2xl w-full my-8 max-h-[80vh] flex flex-col relative z-50">
        <div className="p-6 border-b flex-shrink-0 bg-blue-600 text-white rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Trophy className="mr-2" /> Workout Complete!
              </h2>
              <p className="mt-0.5 text-blue-100">Great job crushing your workout! 💪</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500 rounded-full transition-colors -mr-2 -mt-2"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-semibold">Duration</div>
              <div className="text-2xl font-bold">{formatTime(duration)}</div>
            </div>
            {totalWeight > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 font-semibold">Total Volume</div>
                <div className="text-2xl font-bold">
                  {totalWeight.toLocaleString()} {weightUnit}
                </div>
              </div>
            )}
            {totalDistance > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 font-semibold">Total Distance</div>
                <div className="text-2xl font-bold">{totalDistance.toLocaleString()} m</div>
              </div>
            )}
            {totalTime > 0 && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-indigo-600 font-semibold">Total Time</div>
                <div className="text-2xl font-bold">{formatTime(totalTime)}</div>
              </div>
            )}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 font-semibold">Total Sets</div>
              <div className="text-2xl font-bold">{totalSets}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 font-semibold">PRs Achieved</div>
              <div className="text-2xl font-bold">{totalPRs}</div>
            </div>
          </div>

          {bestSets.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Medal className="mr-2 text-yellow-500" /> Best Sets
              </h3>
              <div className="space-y-3">
                {bestSets.map(set => (
                  <div
                    key={set.exerciseId}
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{set.exerciseName}</div>
                      <div className="text-sm text-gray-600">
                        {set.weight} {weightUnit} × {set.reps} reps
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex-shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoToLogs}
              className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <History size={16} className="mr-2" />
              View Log
            </button>
            <button
              onClick={handleStartNew}
              className="flex items-center justify-center px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Start New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};