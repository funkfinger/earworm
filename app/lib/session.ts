interface User {
  id: string;
  name?: string;
  email?: string;
  accessToken: string;
}

interface Session {
  user?: User;
  earworm?: {
    trackId: string;
    trackName: string;
    artistName: string;
    albumArt?: string;
    timestamp: string;
  };
}

let session: Session = {};

export async function getSession(): Promise<Session> {
  // TODO: Implement proper session management
  // For now, return the in-memory session
  return session;
}

export async function setSession(newSession: Session): Promise<void> {
  session = newSession;
}
