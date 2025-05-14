
import type { MockJamendoTrack } from '@/types';

export const mockJamendoTracks: MockJamendoTrack[] = [
  {
    id: 'jam1',
    title: 'Peaceful Morning Dew',
    artist: 'Serene Scapes',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam1',
    genre: 'calm',
    aiHint: 'calm landscape',
  },
  {
    id: 'jam2',
    title: 'Forest Whisper',
    artist: 'Nature\'s Harmony',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam2',
    genre: 'nature',
    aiHint: 'forest path',
  },
  {
    id: 'jam3',
    title: 'Electric Pulse',
    artist: 'Synthwave Rider',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam3',
    genre: 'energetic',
    aiHint: 'abstract energy',
  },
  {
    id: 'jam4',
    title: 'Study Flow',
    artist: 'Concentration Beats',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam4',
    genre: 'focus',
    aiHint: 'minimalist abstract',
  },
  {
    id: 'jam5',
    title: 'Sunrise Anthem',
    artist: 'Aura Lift',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam5',
    genre: 'uplifting',
    aiHint: 'sunrise sky',
  },
  {
    id: 'jam6',
    title: 'Gentle Piano Breeze',
    artist: 'Soft Notes',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam6',
    genre: 'gentle',
    aiHint: 'piano keys',
  },
  {
    id: 'jam7',
    title: 'Oceanic Calm',
    artist: 'Deep Blue Project',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam7',
    genre: 'calm',
    aiHint: 'ocean depth',
  },
  {
    id: 'jam8',
    title: 'Mountain Peak',
    artist: 'Altitude Sounds',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam8',
    genre: 'uplifting',
    aiHint: 'mountain peak',
  },
  {
    id: 'jam9',
    title: 'Mind Palace',
    artist: 'Focus Finders',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam9',
    genre: 'focus',
    aiHint: 'geometric abstract',
  },
  {
    id: 'jam10',
    title: 'Desert Mirage Beat',
    artist: 'Sandstorm Grooves',
    albumArtUrl: 'https://placehold.co/300x300.png',
    streamUrl: 'mock://stream/jam10',
    genre: 'energetic',
    aiHint: 'desert landscape',
  }
];

// Helper to get tracks based on genre
export const getMockTracksByGenre = (genre: MockJamendoTrack['genre'], count: number = 3): Promise<MockJamendoTrack[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTracks = mockJamendoTracks.filter(track => track.genre === genre);
      resolve(filteredTracks.slice(0, count));
    }, 500); // Simulate network delay
  });
};
