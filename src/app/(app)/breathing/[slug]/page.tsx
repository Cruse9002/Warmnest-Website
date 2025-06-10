
"use client"; 

import { BreathingAnimation } from '@/components/breathing/BreathingAnimation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label }
from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import type { BreathingExercise as BreathingExerciseType } from '@/types'; 
import { ArrowLeft, RotateCcw, Play, Pause, Info } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { mockJamendoTracks } from '@/lib/mockJamendo';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const LOCAL_STORAGE_SKIP_INSTRUCTIONS_KEY_PREFIX = 'warmnest-skip-breathing-instructions-';


// Mock data - in a real app, this would come from a service or context
const exercisesData: Record<string, BreathingExerciseType & { 
  cycleConfig: { state: 'inhale' | 'hold-inhaled' | 'exhale' | 'hold-exhaled'; duration: number }[], // Updated state types
  instructionSteps: { textKey: string, diagramHint: string }[] 
}> = {
  'box-breathing': {
    slug: 'box-breathing',
    nameKey: 'boxBreathing',
    descriptionKey: 'boxBreathingDesc',
    durationMinutes: 5,
    instructionSteps: [
      { textKey: 'boxBreathingStep1', diagramHint: 'person sitting comfortably' },
      { textKey: 'boxBreathingStep2', diagramHint: 'lungs inhale diagram' },
      { textKey: 'boxBreathingStep3', diagramHint: 'holding breath diagram' },
      { textKey: 'boxBreathingStep4', diagramHint: 'lungs exhale diagram' },
      { textKey: 'boxBreathingStep5', diagramHint: 'holding breath empty diagram' },
    ],
    cycleConfig: [
      { state: 'inhale', duration: 4 },
      { state: 'hold-inhaled', duration: 4 }, // Updated state
      { state: 'exhale', duration: 4 },
      { state: 'hold-exhaled', duration: 4 }, // Updated state
    ],
  },
  '4-7-8-breathing': {
    slug: '4-7-8-breathing',
    nameKey: 'fourSevenEightBreathing',
    descriptionKey: 'fourSevenEightBreathingDesc',
    durationMinutes: 3,
    instructionSteps: [
        { textKey: 'fourSevenEightBreathingStep1', diagramHint: 'person comfortable position tongue' },
        { textKey: 'fourSevenEightBreathingStep2', diagramHint: 'exhale whoosh sound' },
        { textKey: 'fourSevenEightBreathingStep3', diagramHint: 'inhale nose count four' },
        { textKey: 'fourSevenEightBreathingStep4', diagramHint: 'hold breath count seven' },
        { textKey: 'fourSevenEightBreathingStep5', diagramHint: 'exhale mouth count eight' },
    ],
    cycleConfig: [
      { state: 'inhale', duration: 4 },
      { state: 'hold-inhaled', duration: 7 }, // Assuming hold after inhale
      { state: 'exhale', duration: 8 },
    ],
  },
  'diaphragmatic-breathing': {
    slug: 'diaphragmatic-breathing',
    nameKey: 'diaphragmaticBreathing',
    descriptionKey: 'diaphragmaticBreathingDesc',
    durationMinutes: 7,
    instructionSteps: [
        { textKey: 'diaphragmaticBreathingStep1', diagramHint: 'person lying knees bent' },
        { textKey: 'diaphragmaticBreathingStep2', diagramHint: 'hands on chest belly' },
        { textKey: 'diaphragmaticBreathingStep3', diagramHint: 'inhale belly out' },
        { textKey: 'diaphragmaticBreathingStep4', diagramHint: 'exhale pursed lips belly in' },
    ],
    cycleConfig: [
      { state: 'inhale', duration: 4 }, 
      { state: 'exhale', duration: 6 }, 
    ],
  },
  'alternate-nostril-breathing': {
    slug: 'alternate-nostril-breathing',
    nameKey: 'alternateNostrilBreathing',
    descriptionKey: 'alternateNostrilBreathingDesc',
    durationMinutes: 5,
    instructionSteps: [
        { textKey: 'alternateNostrilBreathingStep1', diagramHint: 'person meditative posture' },
        { textKey: 'alternateNostrilBreathingStep2', diagramHint: 'hand position nose' },
        { textKey: 'alternateNostrilBreathingStep3', diagramHint: 'inhale left nostril' },
        { textKey: 'alternateNostrilBreathingStep4', diagramHint: 'hold breath both nostrils closed' },
        { textKey: 'alternateNostrilBreathingStep5', diagramHint: 'exhale right nostril inhale right' },
        { textKey: 'alternateNostrilBreathingStep6', diagramHint: 'exhale left nostril' },
    ],
    // This exercise's cycle is more complex and might need more nuanced state representation for perfect animation
    // For now, using generic hold state if the simple distinction isn't enough
    cycleConfig: [
      { state: 'inhale', duration: 4 }, 
      { state: 'hold-inhaled', duration: 2 },
      { state: 'exhale', duration: 4 },
    ],
  },
  'pursed-lip-breathing': {
    slug: 'pursed-lip-breathing',
    nameKey: 'pursedLipBreathing',
    descriptionKey: 'pursedLipBreathingDesc',
    durationMinutes: 4,
    instructionSteps: [
        { textKey: 'pursedLipBreathingStep1', diagramHint: 'person relaxed shoulders' },
        { textKey: 'pursedLipBreathingStep2', diagramHint: 'inhale nose count two' },
        { textKey: 'pursedLipBreathingStep3', diagramHint: 'pursed lips diagram' },
        { textKey: 'pursedLipBreathingStep4', diagramHint: 'exhale pursed lips count four' },
    ],
    cycleConfig: [
      { state: 'inhale', duration: 2 }, 
      { state: 'exhale', duration: 4 }, 
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
  
  const [showInstructionsScreen, setShowInstructionsScreen] = useState(true);
  const [userWantsToSkipInstructions, setUserWantsToSkipInstructions] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Use a default calming track for breathing exercises
  const musicUrl = useMemo(() => mockJamendoTracks.find(track => track.id === 'jam1')?.streamUrl, []);

  const localStorageKey = useMemo(() => {
    if (!slug) return '';
    return `${LOCAL_STORAGE_SKIP_INSTRUCTIONS_KEY_PREFIX}${slug}`;
  }, [slug]);

  useEffect(() => {
    if (!localStorageKey) return; 

    const skip = localStorage.getItem(localStorageKey) === 'true';
    if (skip) {
      setShowInstructionsScreen(false);
    }
    setUserWantsToSkipInstructions(skip); 
  }, [localStorageKey]);

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

  const handleProceedToExercise = () => {
    if (!localStorageKey) return;

    if (userWantsToSkipInstructions) {
      localStorage.setItem(localStorageKey, 'true');
    } else {
      localStorage.removeItem(localStorageKey); 
    }
    setShowInstructionsScreen(false);
  };

  const handleCycleComplete = () => {
    setCompletedCycles(prev => prev + 1);
    // Potentially play a sound cue for cycle completion
    // Example: playSound('/audio/cycle-complete.mp3');
  };
  
  const progress = useMemo(() => {
    if (totalCycles === 0) return 0;
    return (completedCycles / totalCycles) * 100;
  }, [completedCycles, totalCycles]);

  useEffect(() => {
    if (isPlaying && completedCycles >= totalCycles && totalCycles > 0) {
      setIsPlaying(false); 
      // Potentially play an exercise completion sound
      // Example: playSound('/audio/exercise-finished.mp3');
    }
  }, [completedCycles, totalCycles, isPlaying]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && musicUrl) {
      if (isPlaying && !showInstructionsScreen) { 
        audioElement.play().catch(error => console.warn("Audio play failed:", error));
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, musicUrl, showInstructionsScreen]);

  useEffect(() => {
    if (musicUrl && typeof window !== 'undefined' && !audioRef.current) {
        const newAudioElement = new Audio(musicUrl);
        newAudioElement.loop = true;
        audioRef.current = newAudioElement;
        // Note: To play specific frequencies for music therapy, you'd need a different mechanism,
        // possibly Web Audio API for tone generation or selecting specific tracks.
        // This current setup is for background music during breathing.
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; 
      }
    };
  }, [musicUrl]);

  if (!exercise) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">Loading exercise...</p>
      </div>
    );
  }

  const togglePlay = () => {
    if (showInstructionsScreen) return; 
    if (completedCycles >= totalCycles && totalCycles > 0) {
        setCompletedCycles(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
    }
    setIsPlaying(!isPlaying);
  }
  
  const resetExercise = () => {
    setIsPlaying(false);
    setCompletedCycles(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (localStorageKey) {
       const skip = localStorage.getItem(localStorageKey) === 'true';
       if (!skip) setShowInstructionsScreen(true);
    } else {
        setShowInstructionsScreen(true); // Default to show if no key (e.g. slug not ready)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-4 md:p-8">
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      <div className="w-full max-w-2xl">
        <Button variant="ghost" asChild className="mb-4 text-sm sm:text-base">
          <Link href="/breathing">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to exercises
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-2">{t(exercise.nameKey)}</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">{t(exercise.descriptionKey)}</p>
      </div>

      {showInstructionsScreen ? (
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center text-primary">
                <Info className="mr-2 h-6 w-6" />
                {t('howToPerform')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercise.instructionSteps?.map((step, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-4 p-3 border rounded-md bg-card">
                <div className="flex-shrink-0 w-full sm:w-1/3 h-40 sm:h-auto relative">
                  <Image 
                    src={`https://placehold.co/300x200.png`} 
                    alt={`${t(step.textKey)} diagram`} 
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                    data-ai-hint={step.diagramHint}
                  />
                </div>
                <p className="text-sm flex-1">{index + 1}. {t(step.textKey)}</p>
              </div>
            ))}
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox 
                id="skip-instructions" 
                checked={userWantsToSkipInstructions}
                onCheckedChange={(checked) => setUserWantsToSkipInstructions(checked as boolean)}
              />
              <Label htmlFor="skip-instructions" className="text-sm font-normal text-muted-foreground cursor-pointer">
                {t('dontShowInstructionsAgain')}
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProceedToExercise} size="lg" className="w-full bg-primary hover:bg-primary/90">
              {t('startExercise')}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
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
                {isPlaying ? t('pause') : (completedCycles >= totalCycles && totalCycles > 0 ? t('replay') : t('start'))}
                </Button>
                <Button onClick={resetExercise} variant="outline" size="lg" className="w-full sm:w-32">
                    <RotateCcw className="mr-2 h-5 w-5" />
                    {t('reset')}
                </Button>
            </div>
            <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">Progress: {completedCycles} / {totalCycles} cycles</p>
                <div className="w-full bg-muted rounded-full h-2 sm:h-2.5 mt-1">
                    <div className="bg-primary h-2 sm:h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

