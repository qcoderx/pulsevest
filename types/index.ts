// This file is the single source of truth for our project data structures.

export interface Score {
  category: string;
  score: number;
  explanation: string;
}

export interface LiveProject {
  id: number;
  title: string;
  stageName: string;
  realName: string;
  description: string;
  fundingGoal: number;
  fundingReason: string;
  mediaUrl: string;
  imageUrl: string;
  mediaType: "audio" | "video";
  createdAt: string;
  pulseScore: number;
  current: number;
  creator: string;
  suggestions?: string;
  scores?: Score[];
}

export interface Review {
  id: string;
  projectId: number;
  fanName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FanProfile {
  name: string;
  pulsePoints: number;
  favorites: number[]; // Array of project IDs
  following: string[]; // Array of creator stage names
  // --- THE FINAL, CRITICAL ADDITION ---
  playlist: number[]; // Array of project IDs
}
