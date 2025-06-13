"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';
import { Music2, Waves, CloudRain, Volume2, PlayCircle, ListMusic, PauseCircle } from 'lucide-react';
import type { User, MockJamendoTrack } from '@/types';
import { getMockTracksByGenre, mockJamendoTracks } from '@/lib/mockJamendo'; 
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const commonSounds = [
  { id: 'white-noise', nameKey: 'whiteNoise', icon: Volume2, hint: "abstract soundwave", 
    audioSrc: '/assets/audio/white.mp3',
    imageSrc: '/assets/images/whiteNoise.jpg'
  },
  { id: 'rain-sounds', nameKey: 'rainSounds', icon: CloudRain, hint: "rain window",
    audioSrc: '/assets/audio/rain.mp3',
    imageSrc: '/assets/images/rain.jpg'
  },
  { id: 'ocean-waves', nameKey: 'oceanWaves', icon: Waves, hint: "ocean wave",
    audioSrc: '/assets/audio/ocean.mp3',
    imageSrc: '/assets/images/ocean.jpg'
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
  const [currentPlayingSound, setCurrentPlayingSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    const audio = new Audio(track.streamUrl);
    audio.loop = true;
    audioRef.current = audio;
    audio.play().catch(error => {
      console.error("Error playing track:", error);
      toast({ title: "Error", description: "Could not play the track.", variant: "destructive" });
    });
    toast({
      title: `Now Playing`,
      description: `${track.title} by ${track.artist}`,
    });
  };

  const handlePlayCommonSound = (soundNameKey: string) => {
    const sound = commonSounds.find(s => s.nameKey === soundNameKey);
    if (!sound) return;

    if (currentPlayingSound === soundNameKey) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setCurrentPlayingSound(null);
      toast({
        title: `Paused`,
        description: `${t(soundNameKey as any)}`,
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      const audio = new Audio(sound.audioSrc);
      audio.loop = true;
      audioRef.current = audio;
      audio.play().catch(error => {
        console.error("Error playing sound:", error);
        toast({ title: "Error", description: "Could not play the sound.", variant: "destructive" });
      });
      setCurrentPlayingSound(soundNameKey);
      toast({
        title: `Now Playing`,
        description: `${t(soundNameKey as any)}`,
      });
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

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
                <Image
                  src={sound.imageSrc}
                  alt={t(sound.nameKey as any)}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={sound.hint}
                />
                {currentPlayingSound === sound.nameKey && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <PauseCircle className="h-12 w-12 text-white/70" />
                  </div>
                )}
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
                <Button 
                  className="w-full" 
                  variant={currentPlayingSound === sound.nameKey ? "destructive" : "outline"} 
                  onClick={() => handlePlayCommonSound(sound.nameKey)}
                >
                  {currentPlayingSound === sound.nameKey ? (
                    <>
                      <PauseCircle className="mr-2 h-5 w-5" />
                      {t('pause')}
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-5 w-5" />
                      {t('playTrack')}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
