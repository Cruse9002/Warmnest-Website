
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';
import { Music2, Waves, CloudRain, Volume2, PlayCircle } from 'lucide-react';
import type { User } from '@/types';

const commonSounds = [
  { id: 'white-noise', nameKey: 'whiteNoise', icon: Volume2, hint: "abstract soundwave" },
  { id: 'rain-sounds', nameKey: 'rainSounds', icon: CloudRain, hint: "rain window" },
  { id: 'ocean-waves', nameKey: 'oceanWaves', icon: Waves, hint: "ocean wave" },
];

const getPersonalizedSuggestion = (user: User | null, t: (key: any) => string) => {
  if (!user || !user.favoriteColor) {
    return { title: t('gentleMelodies'), description: t('basedOnYourPreferences'), imageHint: "abstract music" };
  }

  switch (user.favoriteColor) {
    case 'blue':
    case 'green':
    case 'white':
      return { title: t('calmingAmbient'), description: t('basedOnYourPreferences'), imageHint: "calm nature" };
    case 'red':
    case 'orange':
    case 'yellow':
      return { title: t('energeticBeats'), description: t('basedOnYourPreferences'), imageHint: "abstract energy" };
    case 'purple':
    case 'pink':
      return { title: t('upliftingTunes'), description: t('basedOnYourPreferences'), imageHint: "uplifting abstract" };
    case 'black':
       return { title: t('focusEnhancingMusic'), description: t('basedOnYourPreferences'), imageHint: "dark abstract" };
    default:
      return { title: t('gentleMelodies'), description: t('basedOnYourPreferences'), imageHint: "soft music" };
  }
};


export default function MusicTherapyPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const suggestion = getPersonalizedSuggestion(user, t);

  const handlePlay = (soundName: string) => {
    // In a real app, this would trigger audio playback
    console.log(`Playing ${soundName}`);
    // toast({ title: `Playing ${soundName}` }); // Optional: add toast notification
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">{t('musicTherapyTitle')}</h1>
        <p className="text-muted-foreground">{t('musicTherapyDescription')}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-primary mb-4">{t('personalizedSuggestions')}</h2>
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-56 w-full">
            <Image
              src={`https://placehold.co/800x400.png`}
              alt={suggestion.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={suggestion.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white">{suggestion.title}</h3>
              <p className="text-sm text-gray-200">{suggestion.description}</p>
            </div>
          </div>
          <CardFooter className="bg-card p-4">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handlePlay(suggestion.title)}>
              <PlayCircle className="mr-2 h-5 w-5" />
              {t('playTrack')}
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-primary mb-4">{t('commonSounds')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonSounds.map((sound) => (
            <Card key={sound.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="relative h-48 w-full">
                 <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={t(sound.nameKey as any)}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={sound.hint}
                  />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center">
                  <sound.icon className="mr-3 h-6 w-6 text-primary" />
                  {t(sound.nameKey as any)}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Optional: Add a short description for each common sound */}
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handlePlay(t(sound.nameKey as any))}>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  {t('playTrack')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
