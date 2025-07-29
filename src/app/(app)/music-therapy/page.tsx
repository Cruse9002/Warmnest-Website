"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';
import { Music2, Waves, CloudRain, Volume2, PlayCircle, ListMusic, PauseCircle, SkipBack, SkipForward, Repeat } from 'lucide-react';
import type { User, MusicTrack } from '@/types';
import { getTracksByGenre } from '@/lib/music';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';

const commonSounds = [
  { id: 'river-flow', nameKey: 'riverFlow', icon: Volume2, hint: "abstract soundwave", 
    audioSrc: '/assets/audio/River.mp3',
    imageSrc: '/assets/images/music/River.jpg',
    description: 'Gentle river ambience ideal for relaxation',
    duration: '6:20'
  },
  { id: 'sleep', nameKey: 'sleep', icon: Volume2, hint: "sleep",
    audioSrc: '/assets/audio/Sleep.mp3',
    imageSrc: '/assets/images/music/Sleep.jpg',
    description: 'Soothing piano piece to ease into sleep',
    duration: '10:00'
  },
  { id: 'ocean-waves', nameKey: 'oceanWaves', icon: Volume2, hint: "ocean wave",
    audioSrc: '/assets/audio/ocean.mp3',
    imageSrc: '/assets/images/music/Ocean.jpg',
    description: 'A deep soundscape that quiets external distractions for profound introspection',
    duration: '8:45'
  },
  { id: 'weightless', nameKey: 'weightless', icon: Volume2, hint: "anxiety buster",
    audioSrc: '/assets/audio/Weightless.mp3',
    imageSrc: '/assets/images/music/Weightless.jpg',
    description: 'Scientifically proven anxiety-reducing track',
    duration: '8:00'
  },
  { id: 'carnatic', nameKey: 'carnatic', icon: Volume2, hint: "carnatic",
    audioSrc: '/assets/audio/Carnatic.mp3',
    imageSrc: '/assets/images/music/Carnatic.jpg',
    description: 'A pure rendition of Raga Neelambari, traditionally used to calm',
    duration: '5:50'
  },
  { id: '852Hz', nameKey: '852Hz', icon: Volume2, hint: "852Hz",
    audioSrc: '/assets/audio/852Hz Frequency.mp3',
    imageSrc: '/assets/images/music/852Hz Frequency.jpg',
    description: 'Healing 852 Hz pure tone for deep calm',
    duration: '6:00'
  }
];

const mapColorToGenre = (color?: User['favoriteColor']): MusicTrack['genre'] => {
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

const getGenreTitleKey = (genre: MusicTrack['genre']): keyof typeof import('@/lib/i18n').translations.en => {
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
  const [suggestedTracks, setSuggestedTracks] = useState<MusicTrack[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  
  const [currentPlayingSound, setCurrentPlayingSound] = useState<string | null>(null);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const personalGenre = mapColorToGenre(user?.favoriteColor);

  // Helper to get the currently playing common sound object (if any)
  const currentSoundObj = currentPlayingSound ? commonSounds.find(s => s.nameKey === currentPlayingSound) || null : null;

  useEffect(() => {
    setIsLoadingTracks(true);
    getTracksByGenre(personalGenre, 3) 
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

  const handlePlayPauseTrack = (track: MusicTrack) => {
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
      audio.loop = isLooping;
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
      audio.loop = isLooping;
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

  // Keep loop state in sync when toggled
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (value / 100) * audio.duration;
      setProgress(value);
    }
  };

  const toggleLoop = () => setIsLooping(prev => !prev);

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

      {(currentPlayingTrack || currentSoundObj) && (
        <section className="fixed bottom-0 left-0 right-0 z-50 p-2">
          <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full max-w-4xl mx-auto">
            <CardContent className="p-4 flex items-center gap-4">
              <Image 
                src={currentPlayingTrack ? currentPlayingTrack!.albumArtUrl : (currentSoundObj!.imageSrc)} 
                alt={currentPlayingTrack ? currentPlayingTrack!.title : t(currentSoundObj!.nameKey as any)}
                width={56} height={56} className="rounded-md object-cover"/>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">
                  {currentPlayingTrack ? currentPlayingTrack!.title : t(currentSoundObj!.nameKey as any)}
                </CardTitle>
                {currentPlayingTrack && (
                  <CardDescription className="truncate">{currentPlayingTrack!.artist}</CardDescription>
                )}
                <Progress value={progress} className="w-full mt-2 h-2" />
                <Slider 
                  value={[progress]} 
                  min={0} max={100} step={0.1}
                  onValueChange={(val) => setProgress(val[0])}
                  onValueCommit={(val) => handleSeek(val[0])}
                  className="w-full mt-2"
                />
              </div>
              <Button variant="ghost" size="icon" disabled>
                <SkipBack className="h-6 w-6"/>
              </Button>
              <Button 
                variant="ghost" size="icon" 
                onClick={() => {
                  if (currentPlayingTrack) {
                    handlePlayPauseTrack(currentPlayingTrack!);
                  } else if (currentSoundObj) {
                    handlePlayCommonSound(currentSoundObj.nameKey);
                  }
                }}
              >
                {isPlaying ? <PauseCircle className="h-8 w-8"/> : <PlayCircle className="h-8 w-8"/>}
              </Button>
              <Button variant="ghost" size="icon" disabled>
                <SkipForward className="h-6 w-6"/>
              </Button>
              <Button 
                variant="ghost" size="icon" 
                onClick={toggleLoop}
                className={isLooping ? 'text-primary' : ''}
              >
                <Repeat className="h-6 w-6"/>
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
        {/* removed external Jamendo attribution as local files are used */}
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
                <p className="text-sm text-muted-foreground">{sound.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{sound.duration}</p>
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
