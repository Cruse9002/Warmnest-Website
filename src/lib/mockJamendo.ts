import type { MockJamendoTrack } from '@/types';

// AUDIO_URL_REQUIRED: The streamUrl properties below are mock URLs. 
// For actual playback, these need to be replaced with valid audio file URLs (e.g., .mp3 links).
// PHOTO_URL_REQUIRED: The albumArtUrl properties are placeholders. 
// Replace with actual album art image URLs.

export const mockJamendoTracks: MockJamendoTrack[] = [
  {
    id: 'jam1',
    title: 'River Flow',
    artist: 'Ambient Sounds',
    albumArtUrl: '/assets/images/music/River.jpg',
    streamUrl: '/assets/audio/River.mp3',
    genre: 'calm',
    aiHint: 'abstract soundwave',
  },
  {
    id: 'jam2',
    title: 'Rain Sounds',
    artist: 'Nature\'s Harmony',
    albumArtUrl: '/assets/images/music/rain.jpg',
    streamUrl: '/assets/audio/rain.mp3',
    genre: 'nature',
    aiHint: 'rain window',
  },
  {
    id: 'jam3',
    title: 'Ocean Waves',
    artist: 'Deep Blue Project',
    albumArtUrl: '/assets/images/music/ocean.jpg',
    streamUrl: '/assets/audio/ocean.mp3',
    genre: 'calm',
    aiHint: 'ocean wave',
  },
  {
    id: 'jam4',
    title: 'Weightless',
    artist: 'Marconi Union',
    albumArtUrl: '/assets/images/music/Weightless.jpg',
    streamUrl: '/assets/audio/Weightless.mp3',
    genre: 'focus',
    aiHint: 'deep',
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
