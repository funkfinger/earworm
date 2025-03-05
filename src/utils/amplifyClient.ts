"use client";

import { generateClient } from "aws-amplify/data";

// Define the schema types based on our data models
export interface Schema {
  models: {
    User: {
      listRecord: {
        filter?: {
          id?: { eq?: string };
          email?: { eq?: string };
          name?: { eq?: string };
        };
        includeInfo?: {
          earworms?: boolean;
        };
      };
      createRecord: {
        id?: string;
        email: string;
        name: string;
      };
      getRecord: {
        id: string;
        includeInfo?: {
          earworms?: boolean;
        };
      };
      updateRecord: {
        id: string;
        email?: string;
        name?: string;
      };
      deleteRecord: {
        id: string;
      };
      record: User;
    };
    Earworm: {
      listRecord: {
        filter?: {
          id?: { eq?: string };
          userId?: { eq?: string };
          stuckSongTitle?: { eq?: string };
          stuckSongArtist?: { eq?: string };
          wasEffective?: { eq?: boolean };
        };
        includeInfo?: {
          user?: boolean;
        };
      };
      createRecord: {
        id?: string;
        userId: string;
        stuckSongTitle: string;
        stuckSongArtist: string;
        replacementSongTitle?: string;
        replacementSongArtist?: string;
        replacementSongId?: string;
        wasEffective?: boolean;
        timestamp: string;
      };
      getRecord: {
        id: string;
        includeInfo?: {
          user?: boolean;
        };
      };
      updateRecord: {
        id: string;
        stuckSongTitle?: string;
        stuckSongArtist?: string;
        replacementSongTitle?: string;
        replacementSongArtist?: string;
        replacementSongId?: string;
        wasEffective?: boolean;
      };
      deleteRecord: {
        id: string;
      };
      record: Earworm;
    };
  };
}

// Define the model types
export interface User {
  id: string;
  email: string;
  name: string;
  earworms?: Earworm[];
}

export interface Earworm {
  id: string;
  userId: string;
  stuckSongTitle: string;
  stuckSongArtist: string;
  replacementSongTitle?: string;
  replacementSongArtist?: string;
  replacementSongId?: string;
  wasEffective?: boolean;
  timestamp: string;
  user?: User;
}

// Create a type-safe client for interacting with the backend
export const client = generateClient<Schema>();
