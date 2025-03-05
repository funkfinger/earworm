// Mock Spotify service for testing

export const mockSongs = [
  { id: "1", title: "Shape of You", artist: "Ed Sheeran" },
  { id: "2", title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
  { id: "3", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
  { id: "4", title: "Blinding Lights", artist: "The Weeknd" },
  { id: "5", title: "Dance Monkey", artist: "Tones and I" },
];

export const mockReplacementSongs = [
  {
    id: "101",
    title: "Baby Shark",
    artist: "Pinkfong",
    spotifyId: "3yfqSUWxFvZELEM4PmlwIR",
  },
  {
    id: "102",
    title: "Let It Go",
    artist: "Idina Menzel",
    spotifyId: "0qcr5FMsEO85NAQjrlDRKo",
  },
  {
    id: "103",
    title: "Happy",
    artist: "Pharrell Williams",
    spotifyId: "60nZcImufyMA1MKQY3dcCH",
  },
  {
    id: "104",
    title: "Call Me Maybe",
    artist: "Carly Rae Jepsen",
    spotifyId: "20I6sIOMTCkB6w7ryavxtO",
  },
  {
    id: "105",
    title: "Gangnam Style",
    artist: "PSY",
    spotifyId: "03UrZgTINDqvnUMbbIMhql",
  },
];

export const spotifyService = {
  login: jest.fn().mockResolvedValue({ success: true }),
  logout: jest.fn().mockResolvedValue({ success: true }),
  searchSongs: jest.fn().mockImplementation((query: string) => {
    return Promise.resolve({
      songs: mockSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
      ),
    });
  }),
  getReplacementSong: jest.fn().mockImplementation(() => {
    const randomIndex = Math.floor(Math.random() * mockReplacementSongs.length);
    return Promise.resolve(mockReplacementSongs[randomIndex]);
  }),
  playSong: jest.fn().mockResolvedValue({ success: true }),
  pauseSong: jest.fn().mockResolvedValue({ success: true }),
  getCurrentPlaybackState: jest.fn().mockResolvedValue({
    isPlaying: true,
    currentSong: mockReplacementSongs[0],
    progress: 50,
    duration: 100,
  }),
};
