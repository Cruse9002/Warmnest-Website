
"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

// Define specific states for breathing cycle including nuanced holds
type BreathingState = 'inhale' | 'hold-inhaled' | 'exhale' | 'hold-exhaled' | 'idle';

interface BreathingAnimationProps {
  cycle: { state: BreathingState; duration: number }[]; 
  onCycleComplete?: () => void;
}

export function BreathingAnimation({ cycle, onCycleComplete }: BreathingAnimationProps) {
  const [currentState, setCurrentState] = useState<BreathingState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0); 
  const { t } = useLanguage();

  useEffect(() => {
    if (currentState === 'idle' && cycle.length > 0) {
      // Start the first cycle
      setCurrentState(cycle[0].state);
      setCurrentIndex(0);
      setAnimationKey(prev => prev + 1); 
      // AUDIO_FILE_REQUIRED: Sound cue for starting the exercise animation.
      // Example: playSound('/audio/animation-start.mp3');
      if (cycle[0].state === 'inhale') {
        // AUDIO_FILE_REQUIRED: Sound cue for 'inhale'.
        // Example: playSound('/audio/inhale-cue.mp3');
      }
      return;
    }

    if (currentState !== 'idle') {
      const currentCycleConfig = cycle[currentIndex];
      const timer = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % cycle.length;
        setCurrentIndex(nextIndex);
        setCurrentState(cycle[nextIndex].state);
        setAnimationKey(prev => prev + 1); 

        // AUDIO_FILE_REQUIRED: Play sound cues based on state
        // Example:
        if (cycle[nextIndex].state === 'inhale') {
            // playSound('/audio/inhale-cue.mp3');
        } else if (cycle[nextIndex].state === 'exhale') {
            // playSound('/audio/exhale-cue.mp3');
        }
        // else if (cycle[nextIndex].state === 'hold-inhaled' || cycle[nextIndex].state === 'hold-exhaled') {
        //   playSound('/audio/hold-cue.mp3'); // Optional
        // }


        if (nextIndex === 0 && onCycleComplete) {
          onCycleComplete(); // This already has a sound cue in the parent component
        }
      }, currentCycleConfig.duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentState, currentIndex, cycle, onCycleComplete]);

  const currentDuration = cycle[currentIndex]?.duration || 0;
  
  const getAnimationClass = () => {
    switch (currentState) {
      case 'inhale':
        return 'animate-inhale';
      case 'exhale':
        return 'animate-exhale';
      case 'hold-inhaled':
        return 'animate-hold-inhaled';
      case 'hold-exhaled':
        return 'animate-hold-exhaled';
      default:
        return '';
    }
  };
  
  const getInstructionText = () => {
    switch (currentState) {
      case 'inhale':
        return t('inhale');
      case 'hold-inhaled':
      case 'hold-exhaled':
        return t('hold');
      case 'exhale':
        return t('exhale');
      default:
        return "Ready?";
    }
  }

  // Placeholder for playing sound - implement actual audio playback here
  // const playSound = (soundFileUrl: string) => { // soundFileUrl would be like '/audio/inhale-cue.mp3'
  //   const audio = new Audio(soundFileUrl); // AUDIO_URL_REQUIRED: soundFileUrl needs to be a valid path
  //   audio.play().catch(e => console.error("Error playing sound:", e));
  // };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 space-y-4 sm:space-y-6">
      <div 
        key={animationKey}
        className={cn(
          "w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/30 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ease-in-out",
          getAnimationClass()
        )}
        style={{ animationDuration: `${currentDuration}s` }}
      >
        <div className={cn(
            "w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-primary/60 rounded-full flex items-center justify-center",
             getAnimationClass()
           )}
             style={{ animationDuration: `${currentDuration}s`, animationDelay: '0.1s' }} 
           >
           <div className={cn(
            "w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-primary rounded-full",
             getAnimationClass()
           )}
             style={{ animationDuration: `${currentDuration}s`, animationDelay: '0.2s' }} 
           />
        </div>
      </div>
      <p className="text-xl sm:text-2xl font-semibold text-primary animate-pulse" style={{ animationDuration: '2s'}}>
        {getInstructionText()}... ({currentDuration}s)
      </p>
      <style jsx global>{`
        @keyframes inhale {
          0% { transform: scale(0.7); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes exhale {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.7); opacity: 0.7; }
        }
        @keyframes hold-inhaled { /* Hold after inhale - stays large */
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.95; } /* Subtle pulse */
        }
        @keyframes hold-exhaled { /* Hold after exhale - stays small */
          0%, 100% { transform: scale(0.7); opacity: 0.7; }
          50% { transform: scale(0.72); opacity: 0.65; } /* Subtle pulse, maintaining smaller size */
        }
        .animate-inhale { animation-name: inhale; animation-timing-function: ease-out; animation-fill-mode: forwards; }
        .animate-exhale { animation-name: exhale; animation-timing-function: ease-in; animation-fill-mode: forwards; }
        .animate-hold-inhaled { animation-name: hold-inhaled; animation-timing-function: linear; animation-fill-mode: forwards; }
        .animate-hold-exhaled { animation-name: hold-exhaled; animation-timing-function: linear; animation-fill-mode: forwards; }
      `}</style>
    </div>
  );
}
