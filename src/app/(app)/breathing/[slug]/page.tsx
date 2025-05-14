
"use client"; // This page uses client-side hooks for state and effects

import { BreathingAnimation } from '@/components/breathing/BreathingAnimation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import type { BreathingExercise as BreathingExerciseType } from '@/types'; // Renamed to avoid conflict
import { ArrowLeft, RotateCcw, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';

// Mock data - in a real app, this would come from a service or context
const exercisesData: Record<string, BreathingExerciseType & { cycleConfig: { state: 'inhale' | 'hold' | 'exhale'; duration: number }[] }> = {
  'box-breathing': {
    slug: 'box-breathing',
    nameKey: 'boxBreathing',
    descriptionKey: 'boxBreathingDesc',
    durationMinutes: 5,
    cycleConfig: [
      { state: 'inhale', duration: 4 },
      { state: 'hold', duration: 4 },
      { state: 'exhale', duration: 4 },
      { state: 'hold', duration: 4 },
    ],
  },
  '4-7-8-breathing': {
    slug: '4-7-8-breathing',
    nameKey: 'fourSevenEightBreathing',
    descriptionKey: 'fourSevenEightBreathingDesc',
    durationMinutes: 3,
    cycleConfig: [
      { state: 'inhale', duration: 4 },
      { state: 'hold', duration: 7 },
      { state: 'exhale', duration: 8 },
    ],
  },
};

export default function BreathingExercisePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLanguage();
  const [exercise, setExercise] = useState<typeof exercisesData[string] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalCycles, setTotalCycles] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    if (slug && exercisesData[slug]) {
      const currentExercise = exercisesData[slug];
      setExercise(currentExercise);
      const cycleDuration = currentExercise.cycleConfig.reduce((sum, s) => sum + s.duration, 0);
      if (cycleDuration > 0) {
        setTotalCycles(Math.floor((currentExercise.durationMinutes * 60) / cycleDuration));
      }
    }
  }, [slug]);

  const handleCycleComplete = () => {
    setCompletedCycles(prev => prev + 1);
  };
  
  const progress = useMemo(() => {
    if (totalCycles === 0) return 0;
    return (completedCycles / totalCycles) * 100;
  }, [completedCycles, totalCycles]);


  useEffect(() => {
    if (isPlaying && completedCycles >= totalCycles && totalCycles > 0) {
      setIsPlaying(false); // Stop when all cycles are done
      // Optionally, show a completion message
    }
  }, [completedCycles, totalCycles, isPlaying]);

  if (!exercise) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">Loading exercise...</p>
      </div>
    );
  }

  const togglePlay = () => {
    if (completedCycles >= totalCycles && totalCycles > 0) { // If exercise finished, reset
        setCompletedCycles(0);
    }
    setIsPlaying(!isPlaying);
  }
  
  const resetExercise = () => {
    setIsPlaying(false);
    setCompletedCycles(0);
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <Button variant="ghost" asChild className="mb-4 text-sm sm:text-base">
          <Link href="/breathing">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to exercises
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-2">{t(exercise.nameKey)}</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">{t(exercise.descriptionKey)}</p>
      </div>

      {isPlaying ? (
        <BreathingAnimation cycle={exercise.cycleConfig} onCycleComplete={handleCycleComplete} />
      ) : (
        <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/10 rounded-full flex items-center justify-center shadow-lg">
          <Play className="w-12 h-12 sm:w-16 sm:h-16 text-primary cursor-pointer" onClick={togglePlay} />
        </div>
      )}
      
      <div className="w-full max-w-xs sm:max-w-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:space-x-4">
            <Button onClick={togglePlay} variant="outline" size="lg" className="w-full sm:w-32">
            {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isPlaying ? 'Pause' : (completedCycles >= totalCycles && totalCycles > 0 ? 'Replay' : 'Start')}
            </Button>
            <Button onClick={resetExercise} variant="outline" size="lg" className="w-full sm:w-32">
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
            </Button>
        </div>
        <div className="text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">Progress: {completedCycles} / {totalCycles} cycles</p>
            <div className="w-full bg-muted rounded-full h-2 sm:h-2.5 mt-1">
                <div className="bg-primary h-2 sm:h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      </div>
    </div>
  );
}
