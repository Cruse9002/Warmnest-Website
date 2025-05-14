
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';
import { Music2, Waves, CloudRain, Volume2, PlayCircle, ListMusic } from 'lucide-react';
import type { User, MockJamendoTrack } from '@/types';
import { getMockTracksByGenre, mockJamendoTracks } from '@/lib/mockJamendo'; // Import mock data and fetcher
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const commonSounds = [
  { id: 'white-noise', nameKey: 'whiteNoise', icon: Volume2, hint: "abstract soundwave" },
  { id: 'rain-sounds', nameKey: 'rainSounds', icon: CloudRain, hint: "rain window" },
  { id: 'ocean-waves', nameKey: 'oceanWaves', icon: Waves, hint: "ocean wave" },
];

const mapColorToGenre = (color?: User['favoriteColor']): MockJamendoTrack['genre'] => {
  switch (color) {
    case 'blue':
    case 'green':
      return 'calm';
    case 'white':
      return 'gentle';
    case 'red':
    case 'orange':
      return 'energetic';
    case 'yellow':
      return 'uplifting';
    case 'purple':
    case 'pink':
      return 'uplifting';
    case 'black':
      return 'focus';
    default:
      return 'gentle'; // Default genre
  }
};

const getGenreTitleKey = (genre: MockJamendoTrack['genre']): keyof typeof import('@/lib/i18n').translations.en => {
    switch (genre) {
        case 'calm': return 'calmingAmbient';
        case 'energetic': return 'energeticBeats';
        case 'focus': return 'focusEnhancingMusic';
        case 'uplifting': return 'upliftingTunes';
        case 'gentle': return 'gentleMelodies';
        case 'nature': return 'natureSounds'; // Though nature is not directly mapped from color
        default: return 'gentleMelodies';
    }
}


export default function MusicTherapyPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [suggestedTracks, setSuggestedTracks] = useState<MockJamendoTrack[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);

  const personalGenre = mapColorToGenre(user?.favoriteColor);

  useEffect(() => {
    setIsLoadingTracks(true);
    getMockTracksByGenre(personalGenre, 3) // Fetch 3 tracks for the personalized genre
      .then(tracks => {
        setSuggestedTracks(tracks);
      })
      .catch(error => {
        console.error("Error fetching mock tracks:", error);
        toast({ title: "Error", description: "Could not load music suggestions.", variant: "destructive" });
      })
      .finally(() => {
        setIsLoadingTracks(false);
      });
  }, [personalGenre, toast]);

  const handlePlayTrack = (track: MockJamendoTrack) => {
    console.log(`Playing ${track.title} from ${track.streamUrl} (mock)`);
    toast({
      title: `Now Playing (Mock)`,
      description: `${track.title} by ${track.artist}`,
    });
  };

  const handlePlayCommonSound = (soundNameKey: string) => {
    toast({
      title: `Now Playing (Mock)`,
      description: `${t(soundNameKey as any)}`,
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">{t('musicTherapyTitle')}</h1>
        <p className="text-muted-foreground">{t('musicTherapyDescription')}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
            <ListMusic className="mr-3 h-7 w-7" /> 
            {t('personalizedSuggestions')} ({t(getGenreTitleKey(personalGenre))})
        </h2>
        <p className="text-sm text-muted-foreground mb-4">{t('jamendoAttribution')}</p>
        {isLoadingTracks ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
                 <Card key={i} className="shadow-lg">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                 </Card>
            ))}
          </div>
        ) : suggestedTracks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedTracks.map((track) => (
              <Card key={track.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="relative h-48 w-full">
                  <Image
                    src={track.albumArtUrl}
                    alt={track.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={track.aiHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{track.title}</CardTitle>
                  <CardDescription className="text-sm">{track.artist}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handlePlayTrack(track)}>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {t('playTrack')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{t('noTracksForPreference')}</p>
        )}
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
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handlePlayCommonSound(sound.nameKey)}>
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
