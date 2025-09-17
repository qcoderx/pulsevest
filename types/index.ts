import { ObjectId } from "mongodb"; // We now import the official MongoDB type

// This file is the single source of truth for our project data structures.

export interface Score {
  category: string;
  score: number;
  explanation: string;
}

export interface LiveProject {
  _id?: ObjectId; // The database's internal ID is an ObjectId
  id: string; // The public-facing ID we will use
  creatorId: string;
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

// --- DEFINITIVE BLUEPRINTS FOR THE FAN ECOSYSTEM ---

export interface Review {
  _id?: ObjectId;
  id: string;
  projectId: string; // Corresponds to LiveProject's public 'id'
  fanId: string; // Corresponds to the Fan's auth ID
  fanName: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
}

export interface FanProfile {
  _id?: ObjectId;
  uid: string; // Firebase Auth UID
  name: string;
  pulsePoints: number;
  favorites: string[]; // Array of project public 'id's
  following: string[]; // Array of creator stage names
  playlist: string[]; // Array of project public 'id's
}
