import type { MusicTrack } from '@/types';

export const musicTracks: MusicTrack[] = [
  {
    id: 'river',
    title: 'River Flow',
    artist: 'Ambient Sounds',
    albumArtUrl: '/assets/images/music/River.jpg',
    streamUrl: '/assets/audio/River.mp3',
    genre: 'calm',
    aiHint: 'abstract soundwave',
  },
  {
    id: 'sleep',
    title: 'Sleep',
    artist: "Max Richter",
    albumArtUrl: '/assets/images/music/Sleep.jpg',
    streamUrl: '/assets/audio/Sleep.mp3',
    genre: 'calm',
    aiHint: 'sleep',
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    artist: 'Deep Blue Project',
    albumArtUrl: '/assets/images/music/Ocean.jpg',
    streamUrl: '/assets/audio/ocean.mp3',
    genre: 'calm',
    aiHint: 'ocean wave',
  },
  {
    id: 'weightless',
    title: 'Weightless',
    artist: 'Marconi Union',
    albumArtUrl: '/assets/images/music/Weightless.jpg',
    streamUrl: '/assets/audio/Weightless.mp3',
    genre: 'focus',
    aiHint: 'deep',
  },
  {
    id: 'carnatic',
    title: 'Nelambari Raga',
    artist: 'Divine Monks',
    albumArtUrl: '/assets/images/music/Carnatic.jpg',
    streamUrl: '/assets/audio/Carnatic.mp3',
    genre: 'calm',
    aiHint: 'carnatic',
  },
  {
    id: '852Hz',
    title: '852Hz Frequency',
    artist: 'Healing Things',
    albumArtUrl: '/assets/images/music/852Hz Frequency.jpg',
    streamUrl: '/assets/audio/852Hz Frequency.mp3',
    genre: 'focus',
    aiHint: '852Hz',
  }
];

// Simple helper that mimics async fetching/filtering of tracks by genre.
export const getTracksByGenre = (
  genre: MusicTrack['genre'],
  count: number = 3,
): Promise<MusicTrack[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = musicTracks.filter((track) => track.genre === genre);
      resolve(filtered.slice(0, count));
    }, 300); // Simulated network delay
  });
}; 