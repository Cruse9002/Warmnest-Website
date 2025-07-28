"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';
import { Music2, Waves, CloudRain, Volume2, PlayCircle, ListMusic, PauseCircle, SkipBack, SkipForward } from 'lucide-react';
import type { User, MockJamendoTrack } from '@/types';
import { getMockTracksByGenre, mockJamendoTracks } from '@/lib/mockJamendo'; 
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const commonSounds = [
  { id: 'river-flow', nameKey: 'riverFlow', icon: Volume2, hint: "abstract soundwave", 
    audioSrc: '/assets/audio/River.mp3',
    imageSrc: '/assets/images/music/River.jpg'
  },
  { id: 'rain-sounds', nameKey: 'rainSounds', icon: CloudRain, hint: "rain window",
    audioSrc: '/assets/audio/rain.mp3',
    imageSrc: '/assets/images/rain.jpg'
  },
  { id: 'ocean-waves', nameKey: 'oceanWaves', icon: Waves, hint: "ocean wave",
    audioSrc: '/assets/audio/ocean.mp3',
    imageSrc: '/assets/images/ocean.jpg'
  },
  { id: 'weightless', nameKey: 'weightless', icon: Waves, hint: "ocean wave",
    audioSrc: '/assets/audio/Weightless.mp3',
    imageSrc: '/assets/images/music/Weightless.jpg'
  }
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
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<MockJamendoTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handlePlayPauseTrack = (track: MockJamendoTrack) => {
    if (currentPlayingTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentPlayingSound(null);
      const audio = new Audio(track.streamUrl);
      audioRef.current = audio;
      audio.play().catch(e => console.error("Audio play error", e));
      setCurrentPlayingTrack(track);
      setIsPlaying(true);
      toast({
        title: t('nowPlaying'),
        description: `${track.title} by ${track.artist}`,
      });
    }
  };

  const handlePlayCommonSound = (soundNameKey: string) => {
    if (currentPlayingSound === soundNameKey) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setCurrentPlayingSound(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentPlayingTrack(null);
      const sound = commonSounds.find(s => s.nameKey === soundNameKey);
      if (!sound) return;

      const audio = new Audio(sound.audioSrc);
      audioRef.current = audio;
      audio.play().catch(e => console.error("Audio play error", e));
      setCurrentPlayingSound(soundNameKey);
      setIsPlaying(true);
      toast({
        title: t('nowPlaying'),
        description: t(soundNameKey as any),
      });
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio && audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
        setIsPlaying(false);
        // Optional: play next track
    }

    audio?.addEventListener('timeupdate', updateProgress);
    audio?.addEventListener('ended', handleEnded);

    return () => {
      audio?.removeEventListener('timeupdate', updateProgress);
      audio?.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.srcObject = null;
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
    <div className="space-y-8 pb-24">
      <section>
        <h1 className="text-3xl font-bold text-foreground">{t('musicTherapyTitle')}</h1>
        <p className="text-muted-foreground">{t('musicTherapyDescription')}</p>
      </section>

      {currentPlayingTrack && (
        <section className="fixed bottom-0 left-0 right-0 z-50 p-2">
            <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full max-w-4xl mx-auto">
                <CardContent className="p-4 flex items-center gap-4">
                    <Image src={currentPlayingTrack.albumArtUrl} alt={currentPlayingTrack.title} width={56} height={56} className="rounded-md object-cover"/>
                    <div className="flex-1">
                        <CardTitle className="text-lg">{currentPlayingTrack.title}</CardTitle>
                        <CardDescription>{currentPlayingTrack.artist}</CardDescription>
                        <Progress value={progress} className="w-full mt-2 h-2" />
                    </div>
                    <Button variant="ghost" size="icon" disabled>
                        <SkipBack className="h-6 w-6"/>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handlePlayPauseTrack(currentPlayingTrack)}>
                        {isPlaying ? <PauseCircle className="h-8 w-8"/> : <PlayCircle className="h-8 w-8"/>}
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                        <SkipForward className="h-6 w-6"/>
                    </Button>
                </CardContent>
            </Card>
        </section>
      )}

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
              <Card key={track.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full group">
                <div className="relative h-48 w-full">
                  <Image
                    src={track.albumArtUrl}
                    alt={track.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="w-20 h-20" onClick={() => handlePlayPauseTrack(track)}>
                      {currentPlayingTrack?.id === track.id && isPlaying ? (
                        <PauseCircle className="h-16 w-16 text-white"/>
                      ) : (
                        <PlayCircle className="h-16 w-16 text-white"/>
                      )}
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{track.title}</CardTitle>
                  <CardDescription className="text-sm">{track.artist}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handlePlayPauseTrack(track)}>
                    {currentPlayingTrack?.id === track.id && isPlaying ? (
                      <>
                        <PauseCircle className="mr-2 h-5 w-5" />
                        {t('pauseTrack')}
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
                  className="object-cover"
                />
                {currentPlayingSound === sound.nameKey && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    { isPlaying ? <PauseCircle className="h-12 w-12 text-white/70" /> : <PlayCircle className="h-12 w-12 text-white/70" /> }
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
                  variant={currentPlayingSound === sound.nameKey && isPlaying ? "default" : "outline"} 
                  onClick={() => handlePlayCommonSound(sound.nameKey)}
                >
                  {currentPlayingSound === sound.nameKey && isPlaying ? (
                    <>
                      <PauseCircle className="mr-2 h-5 w-5" />
                      {t('pauseTrack')}
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
