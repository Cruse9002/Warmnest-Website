import type { MockJamendoTrack } from '@/types';

// AUDIO_URL_REQUIRED: The streamUrl properties below are mock URLs. 
// For actual playback, these need to be replaced with valid audio file URLs (e.g., .mp3 links).
// PHOTO_URL_REQUIRED: The albumArtUrl properties are placeholders. 
// Replace with actual album art image URLs.

export const mockJamendoTracks: MockJamendoTrack[] = [
  {
    id: 'jam1',
    title: 'White Noise',
    artist: 'Ambient Sounds',
    albumArtUrl: '/assets/images/whiteNoise.jpg',
    streamUrl: '/assets/audio/white.mp3',
    genre: 'calm',
    aiHint: 'abstract soundwave',
  },
  {
    id: 'jam2',
    title: 'Rain Sounds',
    artist: 'Nature\'s Harmony',
    albumArtUrl: '/assets/images/rain.jpg',
    streamUrl: '/assets/audio/rain.mp3',
    genre: 'nature',
    aiHint: 'rain window',
  },
  {
    id: 'jam3',
    title: 'Ocean Waves',
    artist: 'Deep Blue Project',
    albumArtUrl: '/assets/images/ocean.jpg',
    streamUrl: '/assets/audio/ocean.mp3',
    genre: 'calm',
    aiHint: 'ocean wave',
  },
  {
    id: 'jam4',
    title: 'Interlinked',
    artist: 'Lonely Lies, GOLDKID',
    albumArtUrl: '/assets/images/Interlinked.jpg',
    streamUrl: '/assets/audio/Lonely Lies, GOLDKID - Interlinked.mp3',
    genre: 'uplifting',
    aiHint: 'deep',
  },
  {
    id: 'jam5',
    title: 'Mortals',
    artist: 'Warriyo',
    albumArtUrl: '/assets/images/Mortals.jpg',
    streamUrl: '/assets/audio/Warriyo - Mortals (ft. Laura Brehm).mp3',
    genre: 'uplifting',
    aiHint: 'hype',
  },
  {
    id: 'jam6',
    title: 'Gentle Piano Breeze',
    artist: 'Soft Notes',
    albumArtUrl: 'https://placehold.co/300x300.png', // Placeholder album art
    streamUrl: 'mock://stream/jam6', // Mock audio stream URL
    genre: 'gentle',
    aiHint: 'piano keys',
  },
  {
    id: 'jam7',
    title: 'Oceanic Calm',
    artist: 'Deep Blue Project',
    albumArtUrl: 'https://placehold.co/300x300.png', // Placeholder album art
    streamUrl: 'mock://stream/jam7', // Mock audio stream URL
    genre: 'calm',
    aiHint: 'ocean depth',
  },
  {
    id: 'jam8',
    title: 'Mind Palace',
    artist: 'Focus Finders',
    albumArtUrl: 'https://placehold.co/300x300.png', // Placeholder album art
    streamUrl: 'mock://stream/jam9', // Mock audio stream URL
    genre: 'focus',
    aiHint: 'geometric abstract',
  },
  {
    id: 'jam9',
    title: 'Desert Mirage Beat',
    artist: 'Sandstorm Grooves',
    albumArtUrl: 'https://placehold.co/300x300.png', // Placeholder album art
    streamUrl: 'mock://stream/jam10', // Mock audio stream URL
    genre: 'energetic',
    aiHint: 'desert landscape',
  }
];

// Helper to get tracks based on genre
// URL_API_MOCK: This function simulates an API call to fetch tracks.
// In a real app, this would likely involve an actual HTTP request to a backend or music service.
export const getMockTracksByGenre = (genre: MockJamendoTrack['genre'], count: number = 3): Promise<MockJamendoTrack[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTracks = mockJamendoTracks.filter(track => track.genre === genre);
      resolve(filteredTracks.slice(0, count));
    }, 500); // Simulate network delay
  });
};
