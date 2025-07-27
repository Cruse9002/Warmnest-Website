"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { QuestionnaireAnswers, User } from '@/types';
import { toast } from '@/hooks/use-toast';
import { translations } from '@/lib/i18n';

type QuestionKey = keyof (typeof translations)['en'];

interface Question {
  id: keyof QuestionnaireAnswers;
  titleKey: QuestionKey;
  type: 'radio' | 'date' | 'select';
  optionsKey?: QuestionKey[];
  optionsValue?: string[];
}

const questions: Question[] = [
  {
    id: 'stressSource',
    titleKey: 'stressSourceQuestion',
    type: 'radio',
    optionsKey: ['work', 'studies', 'relationships', 'health', 'other'],
    optionsValue: ['work', 'studies', 'relationships', 'health', 'other'],
  },
  {
    id: 'copingMechanism',
    titleKey: 'copingMechanismQuestion',
    type: 'radio',
    optionsKey: ['exercise', 'meditation', 'talkingToSomeone', 'hobbies', 'avoidance'],
    optionsValue: ['exercise', 'meditation', 'talkingToSomeone', 'hobbies', 'avoidance'],
  },
  {
    id: 'dob',
    titleKey: 'dateOfBirthQuestion',
    type: 'date',
  },
  {
    id: 'gender',
    titleKey: 'genderQuestion',
    type: 'radio',
    optionsKey: ['male', 'female', 'other', 'preferNotToSay'],
    optionsValue: ['male', 'female', 'other', 'preferNotToSay'],
  },
  {
    id: 'favoriteColor',
    titleKey: 'favoriteColorQuestion',
    type: 'radio',
    optionsKey: ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'black', 'white', 'other_color'],
    optionsValue: ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'black', 'white', 'other_color'],
  }
];

const ONBOARDING_ANSWERS_LS_KEY = 'warmnest-onboarding-answers';

export function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { user, updateUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user has already completed the questionnaire
    if (!authLoading && user?.onboarded) {
      toast({
        title: "Welcome back!",
        description: "You've already completed the onboarding.",
      });
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleAnswerChange = (questionId: keyof QuestionnaireAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }

      const { user: updatedUser } = await response.json();
      updateUser(updatedUser); // Update the user in AuthContext

      toast({
          title: "Onboarding Complete!",
          description: "Your preferences have been saved.",
      });
      router.push('/dashboard');

    } catch (error) {
      console.error("Onboarding submission error:", error);
      toast({ title: "Error", description: "Could not save your preferences.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const progressPercentage = ((currentStep + 1) / questions.length) * 100;
  
  if (authLoading || (user && user.onboarded)) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
          <p>{t('loadingMusic')}</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{t('welcomeToOnboarding')}</CardTitle>
        <CardDescription>{t('questionnaireIntro')}</CardDescription>
        <Progress value={progressPercentage} className="w-full mt-2" />
      </CardHeader>
      <CardContent className="min-h-[250px] sm:min-h-[200px] py-6">
        <form>
          <div className="space-y-6">
            <Label className="text-lg font-semibold">{t(currentQuestion.titleKey)}</Label>
            {currentQuestion.type === 'radio' && currentQuestion.optionsKey && currentQuestion.optionsValue && (
              <RadioGroup 
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                value={answers[currentQuestion.id] || ""}
                className="space-y-2"
              >
                {currentQuestion.optionsKey.map((optionKey, index) => (
                  <div key={optionKey} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={currentQuestion.optionsValue![index]} id={`${currentQuestion.id}-${optionKey}`} />
                    <Label htmlFor={`${currentQuestion.id}-${optionKey}`} className="cursor-pointer flex-1 font-normal">{t(optionKey)}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            {currentQuestion.type === 'date' && (
              <Input
                type="date"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full"
              />
            )}
            {/* Add other input types like 'select' here if needed */}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0 || isLoading}>
          {t('previous')}
        </Button>
        {currentStep < questions.length - 1 ? (
          <Button onClick={nextStep} disabled={!answers[currentQuestion.id] || isLoading}>
            {t('next')}
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!answers[currentQuestion.id] || isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? t('finishing') : t('finish')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
