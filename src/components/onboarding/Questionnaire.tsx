
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { QuestionnaireAnswers, TranslatedStringType } from '@/types';
import { toast } from '@/hooks/use-toast';


interface Question {
  id: keyof QuestionnaireAnswers;
  titleKey: TranslatedStringType;
  optionsKey: TranslatedStringType[];
  optionsValue: string[];
}

const questions: Question[] = [
  {
    id: 'stressSource',
    titleKey: 'stressSourceQuestion',
    optionsKey: ['work', 'studies', 'relationships', 'health', 'other'],
    optionsValue: ['work', 'studies', 'relationships', 'health', 'other'],
  },
  {
    id: 'copingMechanism',
    titleKey: 'copingMechanismQuestion',
    optionsKey: ['exercise', 'meditation', 'talkingToSomeone', 'hobbies', 'avoidance'],
    optionsValue: ['exercise', 'meditation', 'talkingToSomeone', 'hobbies', 'avoidance'],
  },
];

export function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const router = useRouter();

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
    // Mock saving answers to Firestore
    console.log('Submitting answers:', answers);
    if (user) {
      updateUser({ ...user, onboarded: true });
    }
    toast({
        title: "Onboarding Complete!",
        description: "Your preferences have been saved.",
    });
    router.push('/dashboard');
  };

  const currentQuestion = questions[currentStep];
  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{t('welcomeToOnboarding')}</CardTitle>
        <CardDescription>{t('questionnaireIntro')}</CardDescription>
        <Progress value={progressPercentage} className="w-full mt-2" />
      </CardHeader>
      <CardContent className="min-h-[200px]">
        <form>
          <div className="space-y-4">
            <Label className="text-lg font-semibold">{t(currentQuestion.titleKey)}</Label>
            <RadioGroup 
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              value={answers[currentQuestion.id] || ""}
              className="space-y-2"
            >
              {currentQuestion.optionsKey.map((optionKey, index) => (
                <div key={optionKey} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={currentQuestion.optionsValue[index]} id={`${currentQuestion.id}-${optionKey}`} />
                  <Label htmlFor={`${currentQuestion.id}-${optionKey}`} className="cursor-pointer flex-1">{t(optionKey)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          {t('previous')}
        </Button>
        {currentStep < questions.length - 1 ? (
          <Button onClick={nextStep} disabled={!answers[currentQuestion.id]}>
            {t('next')}
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!answers[currentQuestion.id]} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {t('finish')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
