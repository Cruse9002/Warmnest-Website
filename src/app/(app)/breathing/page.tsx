
import { ExerciseCard } from '@/components/breathing/ExerciseCard';
import type { BreathingExercise } from '@/types';

// Mock data for breathing exercises
const exercises: BreathingExercise[] = [
  {
    slug: 'box-breathing',
    nameKey: 'boxBreathing',
    descriptionKey: 'boxBreathingDesc',
    durationMinutes: 5,
  },
  {
    slug: '4-7-8-breathing',
    nameKey: 'fourSevenEightBreathing',
    descriptionKey: 'fourSevenEightBreathingDesc',
    durationMinutes: 3,
  },
  {
    slug: 'diaphragmatic-breathing',
    nameKey: 'diaphragmaticBreathing',
    descriptionKey: 'diaphragmaticBreathingDesc',
    durationMinutes: 7,
  },
  {
    slug: 'alternate-nostril-breathing',
    nameKey: 'alternateNostrilBreathing',
    descriptionKey: 'alternateNostrilBreathingDesc',
    durationMinutes: 5,
  },
  {
    slug: 'pursed-lip-breathing',
    nameKey: 'pursedLipBreathing',
    descriptionKey: 'pursedLipBreathingDesc',
    durationMinutes: 4,
  },
  // Add more exercises here
];

export default function BreathingExercisesPage() {
  // In a real app, `t` would come from useLanguage(), but this is a Server Component.
  // For simplicity, we'll pass keys and let client components translate.
  // Or, this page could be a client component to use the hook.
  // For now, let's keep it simple. Client components will translate.

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Guided Breathing Exercises</h1>
        <p className="text-muted-foreground">Find calm and focus with these simple breathing techniques.</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map(exercise => (
          <ExerciseCard key={exercise.slug} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}

    