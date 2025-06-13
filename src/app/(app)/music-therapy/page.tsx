
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';
import { Music2, Waves, CloudRain, Volume2, PlayCircle, ListMusic } from 'lucide-react';
import type { User, MockJamendoTrack } from '@/types';
import { getMockTracksByGenre, mockJamendoTracks } from '@/lib/mockJamendo'; 
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const commonSounds = [
  { id: 'white-noise', nameKey: 'whiteNoise', icon: Volume2, hint: "abstract soundwave", 
    // AUDIO_URL_REQUIRED: Example for specific audio file for white noise.
    // audioSrc: '/audio/white-noise-60min.mp3' 
  },
  { id: 'rain-sounds', nameKey: 'rainSounds', icon: CloudRain, hint: "rain window",
    // AUDIO_URL_REQUIRED: Example for specific audio file for rain sounds.
    // audioSrc: '/audio/rain-ambience-loop.mp3' 
  },
  { id: 'ocean-waves', nameKey: 'oceanWaves', icon: Waves, hint: "ocean wave",
    // AUDIO_URL_REQUIRED: Example for specific audio file for ocean waves.
    // audioSrc: '/audio/ocean-waves-calm.mp3'
   },
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
      return 'gentle'; 
  }
};

const getGenreTitleKey = (genre: MockJamendoTrack['genre']): keyof typeof import('@/lib/i18n').translations.en => {
    switch (genre) {
        case 'calm': return 'calmingAmbient';
        case 'energetic': return 'energeticBeats';
        case 'focus': return 'focusEnhancingMusic';
        case 'uplifting': return 'upliftingTunes';
        case 'gentle': return 'gentleMelodies';
        case 'nature': return 'natureSounds'; 
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
    getMockTracksByGenre(personalGenre, 3) 
      .then(tracks => {
        setSuggestedTracks(tracks);
        // AUDIO_FEATURE: For specific frequencies, track data could include frequency info (e.g., 'binaural_alpha_10hz').
        // This would then be used with Web Audio API to generate tones or select specific pre-recorded frequency files.
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
    // AUDIO_URL_REQUIRED: track.streamUrl is currently a mock URL. Replace with actual audio file URL.
    // AUDIO_FEATURE: Actual audio playback would happen here using track.streamUrl.
    // For specific frequencies, if track.streamUrl was a generator or pointed
    // to a specific frequency file, it would be handled by an audio player.
    // e.g., playAudio(track.streamUrl, { frequency: track.frequencyData });
    console.log(`Playing ${track.title} from ${track.streamUrl} (mock)`);
    toast({
      title: `Now Playing (Mock)`,
      description: `${track.title} by ${track.artist}`,
    });
  };

  const handlePlayCommonSound = (soundNameKey: string) => {
    const sound = commonSounds.find(s => s.nameKey === soundNameKey);
    // if (sound && sound.audioSrc) playAudio(sound.audioSrc); // AUDIO_URL_REQUIRED: audioSrc needs to be a valid path
    toast({
      title: `Now Playing (Mock)`,
      description: `${t(soundNameKey as any)}`,
    });
  };

  // AUDIO_FEATURE: Example of how Web Audio API could be used for specific frequencies.
  // const playAudioWithFrequency = (frequency: number, durationSeconds: number) => {
  //   const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  //   if (!audioCtx) return;
  //   const oscillator = audioCtx.createOscillator();
  //   oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle'
  //   oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // value in hertz
  //   oscillator.connect(audioCtx.destination);
  //   oscillator.start();
  //   setTimeout(() => oscillator.stop(), durationSeconds * 1000);
  // };

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
        {/* URL_EXTERNAL: Link to Jamendo if actual API is used. */}
        <p className="text-sm text-muted-foreground mb-4">{t('jamendoAttribution')}</p>
        {isLoadingTracks ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
                 <Card key={i} className="shadow-lg">
                    {/* PHOTO_SKELETON: Placeholder for track album art while loading. */}
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
                  {/* PHOTO_DYNAMIC: Album art for the music track. */}
                  {/* URL_DYNAMIC: track.albumArtUrl should point to an actual image. */}
                  <Image
                    src={track.albumArtUrl}
                    alt={track.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={track.aiHint} // data-ai-hint provides keywords for image search
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
                 {/* PHOTO_PLACEHOLDER: Image representing the common sound. */}
                 {/* URL_PLACEHOLDER: Using placehold.co. Replace with actual representative images. */}
                 <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={t(sound.nameKey as any)}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={sound.hint} // data-ai-hint for image search
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
