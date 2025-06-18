"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { TaskAssessmentQuestionnaire } from '@/types';

interface Question {
  id: keyof Omit<TaskAssessmentQuestionnaire, 'timestamp' | 'userId'>;
  labelKey: string;
  minLabelKey: string;
  maxLabelKey: string;
}

const questions: Question[] = [
  {
    id: 'mentalChallenge',
    labelKey: 'mentalChallengeQuestion',
    minLabelKey: 'notChallenging',
    maxLabelKey: 'veryChallenging',
  },
  {
    id: 'physicalDemand',
    labelKey: 'physicalDemandQuestion',
    minLabelKey: 'notDemanding',
    maxLabelKey: 'veryDemanding',
  },
  {
    id: 'timePressure',
    labelKey: 'timePressureQuestion',
    minLabelKey: 'notRushed',
    maxLabelKey: 'veryRushed',
  },
  {
    id: 'successLevel',
    labelKey: 'successLevelQuestion',
    minLabelKey: 'notSuccessful',
    maxLabelKey: 'verySuccessful',
  },
  {
    id: 'effortRequired',
    labelKey: 'effortRequiredQuestion',
    minLabelKey: 'notHard',
    maxLabelKey: 'veryHard',
  },
  {
    id: 'stressLevel',
    labelKey: 'stressLevelQuestion',
    minLabelKey: 'notStressed',
    maxLabelKey: 'veryStressed',
  },
];

export function TaskAssessment() {
  const [answers, setAnswers] = useState<Partial<TaskAssessmentQuestionnaire>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleSliderChange = (questionId: keyof Omit<TaskAssessmentQuestionnaire, 'timestamp' | 'userId'>, value: number[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value[0] }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => answers[q.id] === undefined);
    if (unansweredQuestions.length > 0) {
      toast({ 
        title: "Incomplete Assessment", 
        description: "Please answer all questions before submitting.", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/task-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          assessment: answers 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      toast({
        title: t('assessmentSubmitted' as any),
        description: "Your task assessment has been saved.",
      });

      // Reset form
      setAnswers({});

    } catch (error) {
      console.error("Task assessment submission error:", error);
      toast({ 
        title: "Error", 
        description: t('assessmentError' as any), 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete = questions.every(q => answers[q.id] !== undefined);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{t('taskAssessmentTitle' as any)}</CardTitle>
        <CardDescription>{t('taskAssessmentDescription' as any)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((question) => (
          <div key={question.id} className="space-y-4">
            <Label className="text-lg font-medium">
              {t(question.labelKey as any)}
            </Label>
            <div className="space-y-2">
              <Slider
                value={[answers[question.id] || 50]}
                onValueChange={(value) => handleSliderChange(question.id, value)}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t(question.minLabelKey as any)}</span>
                <span className="font-medium">{answers[question.id] || 50}</span>
                <span>{t(question.maxLabelKey as any)}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormComplete || isSubmitting}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isSubmitting ? "Submitting..." : t('submitAssessment' as any)}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 