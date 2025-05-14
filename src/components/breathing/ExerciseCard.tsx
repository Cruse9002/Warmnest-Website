
"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Clock } from 'lucide-react';
import type { BreathingExercise } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';

interface ExerciseCardProps {
  exercise: BreathingExercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="relative h-48 w-full">
        <Image 
          src={`https://placehold.co/600x400.png?bg=${Math.random().toString(16).substr(-6)}`} // Random placeholder color
          alt={t(exercise.nameKey)} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint="nature serene"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-primary">{t(exercise.nameKey)}</CardTitle>
        <CardDescription className="text-sm h-10 overflow-hidden text-ellipsis">
          {t(exercise.descriptionKey)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>{exercise.durationMinutes} min</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/breathing/${exercise.slug}`}>
            <Wind className="mr-2 h-4 w-4" />
            {t('startExercise')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
