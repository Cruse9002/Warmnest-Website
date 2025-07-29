"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PomodoroTimer } from "@/components/focus/PomodoroTimer";
import { TwoMinuteRule } from "@/components/focus/TwoMinuteRule";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Music, PlayCircle, PauseCircle, Disc3 } from 'lucide-react';
import type { MusicTrack } from '@/types';
import { getTracksByGenre } from '@/lib/music';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function FocusModePage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [focusTracks, setFocusTracks] = useState<MusicTrack[]>([]);
  const [currentMusicTrack, setCurrentMusicTrack] = useState<MusicTrack | null>(null);
  const [isMusicAudioPlaying, setIsMusicAudioPlaying] = useState(false);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoadingMusic, setIsLoadingMusic] = useState(true);

  // Fetch focus tracks
  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoadingMusic(true);
      let tracks = await getTracksByGenre('focus', 3);
      if (tracks.length < 3) {
        const gentleTracks = await getTracksByGenre('gentle', 3 - tracks.length);
        tracks = [...tracks, ...gentleTracks];
      }
      // Ensure no duplicates if both calls return same tracks by chance
      const uniqueTracks = Array.from(new Map(tracks.map(track => [track.id, track])).values());
      setFocusTracks(uniqueTracks.slice(0, 3));
      setIsLoadingMusic(false);
    };
    fetchTracks();
  }, []);

  // Effect to setup and change audio source
  useEffect(() => {
    if (currentMusicTrack && currentMusicTrack.streamUrl) {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current.src = '';
      }
      const newAudio = new Audio(currentMusicTrack.streamUrl);
      newAudio.loop = true;
      musicAudioRef.current = newAudio;
      
      if (isMusicAudioPlaying) {
        musicAudioRef.current.play().catch(error => {
          console.error("Error playing track:", error);
          toast({ title: "Error", description: "Could not play the track.", variant: "destructive" });
        });
      }
    }
    // Cleanup when currentMusicTrack is removed or component unmounts
    return () => {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current.src = '';
      }
    };
  }, [currentMusicTrack, toast]);

  // Effect to play/pause audio
  useEffect(() => {
    const audioElement = musicAudioRef.current;
    if (audioElement) {
      if (isMusicAudioPlaying) {
        audioElement.play().catch(error => {
          console.error("Error playing track:", error);
          toast({ title: "Error", description: "Could not play the track.", variant: "destructive" });
        });
      } else {
        audioElement.pause();
      }
    }
  }, [isMusicAudioPlaying, toast]);

  const handleSelectMusicTrack = (track: MusicTrack) => {
    if (currentMusicTrack?.id === track.id) {
      setIsMusicAudioPlaying(prev => !prev);
    } else {
      setCurrentMusicTrack(track);
      setIsMusicAudioPlaying(true);
    }
  };

  const handleMainMusicToggle = () => {
    if (currentMusicTrack) {
      setIsMusicAudioPlaying(prev => !prev);
    } else if (focusTracks.length > 0) {
      setCurrentMusicTrack(focusTracks[0]);
      setIsMusicAudioPlaying(true);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">{t('focusModeTitle')}</h1>
        <p className="text-muted-foreground">{t('focusModeDescription')}</p>
      </section>

      <Tabs defaultValue="pomodoro" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pomodoro">{t('pomodoroTechnique')}</TabsTrigger>
          <TabsTrigger value="2minrule">{t('twoMinuteRule')}</TabsTrigger>
        </TabsList>

        <TabsContent value="pomodoro">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{t('pomodoroTechnique')}</CardTitle>
              <CardDescription>{t('pomodoroDescription')}</CardDescription>
            </CardHeader>
            <PomodoroTimer />
          </Card>
        </TabsContent>

        <TabsContent value="2minrule">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{t('twoMinuteRule')}</CardTitle>
              <CardDescription>{t('twoMinuteRuleDescription')}</CardDescription>
            </CardHeader>
            <TwoMinuteRule />
          </Card>
        </TabsContent>
      </Tabs>

      <section className="mt-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-primary">
              <Music className="mr-3 h-7 w-7" /> {t('focusMusicTitle')}
            </CardTitle>
            <CardDescription>{t('focusMusicDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingMusic ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="p-4 space-y-3">
                    <Skeleton className="h-32 w-full rounded-md" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </Card>
                ))}
              </div>
            ) : focusTracks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">{t('noFocusTracks')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {focusTracks.map((track) => (
                  <Card 
                    key={track.id} 
                    onClick={() => handleSelectMusicTrack(track)}
                    className={cn(
                        "overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200",
                        currentMusicTrack?.id === track.id ? "ring-2 ring-primary shadow-xl" : "shadow-md"
                    )}
                  >
                    <div className="relative h-32 w-full">
                      <Image
                        src={track.albumArtUrl}
                        alt={track.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={track.aiHint}
                      />
                      {currentMusicTrack?.id === track.id && isMusicAudioPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <PauseCircle className="h-12 w-12 text-white/80" />
                        </div>
                      )}
                      {currentMusicTrack?.id === track.id && !isMusicAudioPlaying && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <PlayCircle className="h-12 w-12 text-white/70" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-3">
                      <CardTitle className="text-base truncate">{track.title}</CardTitle>
                      <CardDescription className="text-xs truncate">{track.artist}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-muted/30 rounded-lg shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Disc3 className={`h-10 w-10 text-primary ${isMusicAudioPlaying && currentMusicTrack ? 'animate-spin slow-spin' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {currentMusicTrack ? currentMusicTrack.title : t('noTrackSelected')}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentMusicTrack ? currentMusicTrack.artist : '---'}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleMainMusicToggle} 
                  variant="ghost" 
                  size="lg" 
                  disabled={focusTracks.length === 0 && !currentMusicTrack}
                  className="p-2"
                >
                  {isMusicAudioPlaying ? <PauseCircle className="h-7 w-7 text-primary" /> : <PlayCircle className="h-7 w-7 text-primary" />}
                  <span className="sr-only">{isMusicAudioPlaying ? t('pause') : t('playTrack')}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <style jsx global>{`
        .slow-spin {
          animation-duration: 3s;
        }
      `}</style>
    </div>
  );
}

    