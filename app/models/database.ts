import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const docClient = DynamoDBDocumentClient.from(client);

// Define table names
export const TABLES = {
  USERS: "deworm-users",
  SONGS: "deworm-songs",
  HISTORY: "deworm-history",
} as const;

// Define types
export interface User {
  id: string; // Spotify user ID
  email: string;
  displayName: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface Song {
  id: string; // Spotify track ID
  title: string;
  artist: string;
  uri: string;
  effectiveness: number; // 0-1 score
  playCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface History {
  id: string; // UUID
  userId: string;
  earwormSongId: string;
  replacementSongId: string;
  effectiveness: number; // 0-1 score
  createdAt: string;
  updatedAt: string;
}

// Database operations
export const db = {
  // User operations
  async createUser(
    user: Omit<User, "createdAt" | "lastLoginAt">
  ): Promise<User> {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      createdAt: now,
      lastLoginAt: now,
    };

    await docClient.send({
      TableName: TABLES.USERS,
      Item: newUser,
      ConditionExpression: "attribute_not_exists(id)",
    });

    return newUser;
  },

  async getUser(id: string): Promise<User | null> {
    const result = await docClient.send({
      TableName: TABLES.USERS,
      Key: { id },
    });

    return (result.Item as User) || null;
  },

  async updateUserLastLogin(id: string): Promise<void> {
    await docClient.send({
      TableName: TABLES.USERS,
      Key: { id },
      UpdateExpression: "SET lastLoginAt = :now",
      ExpressionAttributeValues: {
        ":now": new Date().toISOString(),
      },
    });
  },

  // Song operations
  async createSong(
    song: Omit<Song, "createdAt" | "updatedAt" | "playCount" | "effectiveness">
  ): Promise<Song> {
    const now = new Date().toISOString();
    const newSong: Song = {
      ...song,
      createdAt: now,
      updatedAt: now,
      playCount: 0,
      effectiveness: 0,
    };

    await docClient.send({
      TableName: TABLES.SONGS,
      Item: newSong,
      ConditionExpression: "attribute_not_exists(id)",
    });

    return newSong;
  },

  async getSong(id: string): Promise<Song | null> {
    const result = await docClient.send({
      TableName: TABLES.SONGS,
      Key: { id },
    });

    return (result.Item as Song) || null;
  },

  async updateSongEffectiveness(
    id: string,
    effectiveness: number
  ): Promise<void> {
    await docClient.send({
      TableName: TABLES.SONGS,
      Key: { id },
      UpdateExpression: "SET effectiveness = :effectiveness, updatedAt = :now",
      ExpressionAttributeValues: {
        ":effectiveness": effectiveness,
        ":now": new Date().toISOString(),
      },
    });
  },

  // History operations
  async createHistory(
    history: Omit<History, "id" | "createdAt" | "updatedAt">
  ): Promise<History> {
    const now = new Date().toISOString();
    const newHistory: History = {
      ...history,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send({
      TableName: TABLES.HISTORY,
      Item: newHistory,
    });

    return newHistory;
  },

  async getUserHistory(userId: string): Promise<History[]> {
    const result = await docClient.send({
      TableName: TABLES.HISTORY,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });

    return (result.Items as History[]) || [];
  },
};
