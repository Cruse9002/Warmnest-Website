
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Coffee, Briefcase } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

const WORK_DURATION = 25 * 60; 
const SHORT_BREAK_DURATION = 5 * 60; 
const LONG_BREAK_DURATION = 15 * 60; 
const CYCLES_BEFORE_LONG_BREAK = 4;

type Mode = 'work' | 'shortBreak' | 'longBreak' | 'idle';

// Placeholder for playing sound - implement actual audio playback here
// const playSound = (soundFile: string) => {
//   const audio = new Audio(soundFile); // Assumes soundFile is like '/audio/timer-end.mp3'
//   audio.play().catch(e => console.error("Error playing sound:", e));
// };

export function PomodoroTimer() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION);
  const [mode, setMode] = useState<Mode>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosThisCycle, setPomodorosThisCycle] = useState(0);
  const [totalPomodoros, setTotalPomodoros] = useState(0);

  const handleModeChangeNotification = useCallback((newMode: Mode) => {
    let title = "";
    let description = "";
    // let soundToPlay = ""; // To determine which sound to play

    switch (newMode) {
        case 'work':
            title = t('backToWork');
            description = t('pomodoroDescription');
            // soundToPlay = '/audio/work-start.mp3';
            break;
        case 'shortBreak':
            title = t('takeYourBreak');
            description = `${t('shortBreak')} - ${SHORT_BREAK_DURATION / 60} ${t('minutes') || 'minutes'}`;
            // soundToPlay = '/audio/break-start.mp3';
            break;
        case 'longBreak':
            title = t('longBreakTime');
            description = `${t('longBreak')} - ${LONG_BREAK_DURATION / 60} ${t('minutes') || 'minutes'}`;
            // soundToPlay = '/audio/long-break-start.mp3';
            break;
        default:
            return;
    }
    toast({ title, description });
    // if (soundToPlay) playSound(soundToPlay);
  }, [t, toast]);


  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
        // Optionally play a ticking sound every second or at specific intervals
        // if (timeRemaining % 60 === 0) playSound('/audio/minute-tick.mp3');
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      // playSound('/audio/timer-end-chime.mp3'); // Sound for when any timer ends
      if (mode === 'work') {
        setTotalPomodoros(prev => prev + 1);
        const newPomodorosThisCycle = pomodorosThisCycle + 1;
        setPomodorosThisCycle(newPomodorosThisCycle);
        if (newPomodorosThisCycle % CYCLES_BEFORE_LONG_BREAK === 0) {
          setMode('longBreak');
          setTimeRemaining(LONG_BREAK_DURATION);
          handleModeChangeNotification('longBreak');
        } else {
          setMode('shortBreak');
          setTimeRemaining(SHORT_BREAK_DURATION);
          handleModeChangeNotification('shortBreak');
        }
      } else if (mode === 'shortBreak' || mode === 'longBreak') {
        setMode('work');
        setTimeRemaining(WORK_DURATION);
        if (mode === 'longBreak') setPomodorosThisCycle(0); 
        handleModeChangeNotification('work');
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeRemaining, mode, pomodorosThisCycle, t, toast, handleModeChangeNotification]);

  const handleStartPause = () => {
    if (mode === 'idle') {
      setMode('work');
      setTimeRemaining(WORK_DURATION);
      handleModeChangeNotification('work');
      // playSound('/audio/timer-start.mp3');
    } else {
        // playSound(isRunning ? '/audio/timer-pause.mp3' : '/audio/timer-resume.mp3');
    }
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode('idle');
    setTimeRemaining(WORK_DURATION);
    setPomodorosThisCycle(0);
    setTotalPomodoros(0); 
    toast({ title: "Timer Reset", description: "Pomodoro timer has been reset."});
    // playSound('/audio/timer-reset.mp3');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentModeDuration = () => {
    switch (mode) {
      case 'work': return WORK_DURATION;
      case 'shortBreak': return SHORT_BREAK_DURATION;
      case 'longBreak': return LONG_BREAK_DURATION;
      default: return WORK_DURATION;
    }
  };
  
  const progressValue = mode === 'idle' ? 0 : ((getCurrentModeDuration() - timeRemaining) / getCurrentModeDuration()) * 100;

  const getModeText = () => {
    switch (mode) {
      case 'work': return t('workTime');
      case 'shortBreak': return t('shortBreak');
      case 'longBreak': return t('longBreak');
      default: return t('pomodoroTechnique');
    }
  };
  
  const ModeIcon = mode === 'work' ? Briefcase : Coffee;

  return (
    <>
      <CardContent className="flex flex-col items-center justify-center space-y-6 p-6 md:p-8">
        <div className="text-center">
          <div className="flex items-center justify-center text-xl font-semibold text-primary mb-2">
            <ModeIcon className="mr-2 h-6 w-6" />
            <span>{getModeText()}</span>
          </div>
          <p className="text-6xl md:text-7xl font-bold text-foreground tracking-tighter">
            {formatTime(timeRemaining)}
          </p>
        </div>

        <div className="w-full max-w-md space-y-2">
            <Progress value={progressValue} className="h-3" />
            <p className="text-sm text-muted-foreground text-center">
                {t('pomodorosCompleted')} {pomodorosThisCycle} / {CYCLES_BEFORE_LONG_BREAK}
                {totalPomodoros > 0 && ` (Total: ${totalPomodoros})`}
            </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 p-6">
        <Button onClick={handleStartPause} size="lg" className="w-full sm:w-auto min-w-[120px]">
          {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
          {isRunning ? t('pause') : (mode === 'idle' ? t('start') : t('start'))}
        </Button>
        <Button onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto min-w-[120px]">
          <RotateCcw className="mr-2 h-5 w-5" />
          {t('reset')}
        </Button>
      </CardFooter>
    </>
  );
}
