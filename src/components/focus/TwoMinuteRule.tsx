
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Play, RotateCcw, CheckCircle, Hourglass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

const TWO_MINUTE_DURATION = 2 * 60; // 2 minutes

export function TwoMinuteRule() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState(TWO_MINUTE_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState("");
  const [isTaskDone, setIsTaskDone] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      setIsRunning(false);
      setIsTaskDone(true); // Assume task is done when timer ends
      toast({ title: t('taskCompleted'), description: task || "Great job!"});
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeRemaining, t, toast, task]);

  const handleStartTimer = () => {
    setTimeRemaining(TWO_MINUTE_DURATION);
    setIsRunning(true);
    setIsTaskDone(false);
    toast({ title: "2-Minute Timer Started", description: "Focus on your task!" });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(TWO_MINUTE_DURATION);
    setTask("");
    setIsTaskDone(false);
  };

  const handleMarkDone = () => {
    setIsRunning(false);
    setIsTaskDone(true);
    toast({ title: t('taskCompleted'), description: task || "Well done!" });
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const progressValue = ((TWO_MINUTE_DURATION - timeRemaining) / TWO_MINUTE_DURATION) * 100;

  return (
    <>
      <CardContent className="flex flex-col items-center justify-center space-y-6 p-6 md:p-8">
        <div className="text-center">
          {isTaskDone ? (
             <div className="flex flex-col items-center text-green-500">
                <CheckCircle className="h-16 w-16 mb-2" />
                <p className="text-2xl font-semibold">{t('taskCompleted')}</p>
             </div>
          ) : isRunning ? (
            <>
              <div className="flex items-center justify-center text-xl font-semibold text-primary mb-2">
                <Hourglass className="mr-2 h-6 w-6" />
                <span>{t('twoMinuteRule')}</span>
              </div>
              <p className="text-6xl md:text-7xl font-bold text-foreground tracking-tighter">
                {formatTime(timeRemaining)}
              </p>
            </>
          ) : (
            <p className="text-lg text-muted-foreground px-4">{t('twoMinuteRuleDescription')}</p>
          )}
        </div>

        {!isTaskDone && (
            <Input 
                type="text"
                placeholder={t('whatsTheTask')}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full max-w-sm"
                disabled={isRunning}
            />
        )}
        
        {!isTaskDone && isRunning && (
             <div className="w-full max-w-md space-y-2">
                <Progress value={progressValue} className="h-3" />
            </div>
        )}

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 p-6">
        {!isRunning && !isTaskDone && (
          <Button onClick={handleStartTimer} size="lg" className="w-full sm:w-auto">
            <Play className="mr-2 h-5 w-5" />
            {t('startTwoMinuteTimer')}
          </Button>
        )}
        {isRunning && !isTaskDone && (
             <Button onClick={handleMarkDone} variant="outline" size="lg" className="w-full sm:w-auto">
                <CheckCircle className="mr-2 h-5 w-5" />
                {t('markDone')}
            </Button>
        )}
        {(isRunning || isTaskDone) && (
          <Button onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-5 w-5" />
            {t('reset')}
          </Button>
        )}
      </CardFooter>
    </>
  );
}

    