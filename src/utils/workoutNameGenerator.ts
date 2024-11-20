import { Exercise, MuscleGroup } from '../types/workout';

type MuscleGroupCategory = {
  name: string;
  groups: MuscleGroup[];
  minGroupsRequired?: number;
};

const muscleGroupCategories: MuscleGroupCategory[] = [
  {
    name: 'Push',
    groups: ['Chest', 'Shoulders', 'Triceps'],
    minGroupsRequired: 2
  },
  {
    name: 'Pull',
    groups: ['Back', 'Biceps'],
    minGroupsRequired: 2
  },
  {
    name: 'Legs',
    groups: ['Quads', 'Hamstrings', 'Calves', 'Glutes'],
    minGroupsRequired: 2
  },
  {
    name: 'Upper Body',
    groups: ['Chest', 'Back', 'Shoulders', 'Triceps', 'Biceps'],
    minGroupsRequired: 3
  },

  {
    name: 'Arms',
    groups: ['Biceps', 'Triceps'],
    minGroupsRequired: 2
  },
  {
    name: 'Core',
    groups: ['Core']
  }
];

const shouldGroupAsCategory = (
  muscleGroups: MuscleGroup[], 
  category: MuscleGroupCategory
): boolean => {
  const matchingGroups = muscleGroups.filter(group => category.groups.includes(group));
  return matchingGroups.length >= (category.minGroupsRequired || category.groups.length);
};

export const generateWorkoutName = (exercises: Exercise[]): string => {
  if (!exercises.length) return '';

  // Get unique muscle groups from selected exercises
  const muscleGroups = [...new Set(exercises.map(ex => ex.muscleGroup))];

  // Check if all exercises are from a single muscle group
  if (muscleGroups.length === 1) {
    return `${muscleGroups[0]} Session`;
  }

  // Initialize arrays to store categorized and uncategorized muscle groups
  const parts: string[] = [];
  const processedGroups = new Set<MuscleGroup>();

  // Check for full category matches first
  muscleGroupCategories.forEach(category => {
    const categoryGroups = muscleGroups.filter(group => category.groups.includes(group));
    
    if (shouldGroupAsCategory(categoryGroups, category)) {
      parts.push(category.name);
      categoryGroups.forEach(group => processedGroups.add(group));
    }
  });

  // Special handling for specific combinations
  const hasLegs = muscleGroups.some(group => ['Quads', 'Hamstrings', 'Calves', 'Glutes'].includes(group));
  const hasArms = muscleGroups.some(group => ['Biceps', 'Triceps'].includes(group));
  const hasUpper = muscleGroups.some(group => ['Chest', 'Back', 'Shoulders'].includes(group));

  if (hasLegs && hasUpper) {
    return 'Full Body Session';
  }

  // Add remaining unprocessed muscle groups
  muscleGroups
    .filter(group => !processedGroups.has(group))
    .forEach(group => {
      // Don't add individual leg muscles if we already have "Legs"
      if (parts.includes('Legs') && ['Quads', 'Hamstrings', 'Calves', 'Glutes'].includes(group)) {
        return;
      }
      // Don't add individual arm muscles if we already have "Arms"
      if (parts.includes('Arms') && ['Biceps', 'Triceps'].includes(group)) {
        return;
      }
      parts.push(group);
    });

  // Format the final name
  if (parts.length === 0) {
    return 'Full Body Session';
  } else if (parts.length === 1) {
    return `${parts[0]} Session`;
  } else {
    // Sort parts to ensure consistent ordering
    parts.sort((a, b) => {
      // Custom sorting order
      const order = [
        'Upper Body', 'Lower Body', 'Push', 'Pull', 'Legs', 'Arms',
        'Chest', 'Back', 'Shoulders', 'Triceps', 'Biceps',
        'Quads', 'Hamstrings', 'Calves', 'Glutes', 'Core'
      ];
      return order.indexOf(a) - order.indexOf(b);
    });

    const lastPart = parts.pop();
    return `${parts.join(', ')} & ${lastPart} Session`;
  }
};

// Example combinations that will now work correctly:
// - Shoulders, Quads & Biceps Session
// - Push & Legs Session
// - Upper Body & Core Session
// - Chest, Back & Arms Session
// - Full Body Session (when mixing upper and lower body exercises)
// - Legs & Core Session
// - Push & Arms Session
// - Back & Shoulders Session