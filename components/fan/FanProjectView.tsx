// pulsevest/components/fan/FanProjectView.tsx
"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  ListMusic,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider"; // Import the auth hook
import { LiveProject, Review } from "@/types";
import { MediaViewer } from "@/components/investor/MediaViewer";
import { PulseScoreOrbital } from "@/components/investor/PulseScoreOrbital";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "../ui/Textarea";
import { cn } from "@/lib/utils";

interface FanProjectViewProps {
  project: LiveProject;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isInPlaylist: boolean;
  onTogglePlaylist: () => void;
}

export function FanProjectView({
  project,
  onBack,
  isFavorite,
  onToggleFavorite,
  isInPlaylist,
  onTogglePlaylist,
}: FanProjectViewProps) {
  const { user } = useAuth(); // Get the authenticated user
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  const reviewStorageKey = `pulsevest_reviews_${project.id}`;

  useEffect(() => {
    try {
      const storedReviews = localStorage.getItem(reviewStorageKey);
      if (storedReviews) setReviews(JSON.parse(storedReviews));
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  }, [project.id, reviewStorageKey]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || newRating === 0) {
      alert("Please leave a rating and a comment.");
      return;
    }
    // --- THIS IS THE FIX ---
    // We now include the fanId from the logged-in user.
    if (!user) {
      alert("You must be logged in to leave a review.");
      return;
    }

    const newReview: Review = {
      id: new Date().toISOString(),
      projectId: project.id,
      fanId: user.uid, // Add the user's ID
      fanName: user.displayName || "Anonymous Fan", // Use user's display name
      rating: newRating,
      comment: newComment,
      createdAt: new Date().toISOString(),
    };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem(reviewStorageKey, JSON.stringify(updatedReviews));
    setNewComment("");
    setNewRating(0);
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Discovery</span>
      </button>
      <div className="lg:grid lg:grid-cols-5 lg:gap-12">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2">
          <MediaViewer project={project} />
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button onClick={onToggleFavorite} size="lg" className="!text-base">
              <Heart
                className={cn(
                  "w-5 h-5 mr-2",
                  isFavorite && "fill-red-500 text-red-500"
                )}
              />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            <Button
              onClick={onTogglePlaylist}
              size="lg"
              variant="outline"
              className="!text-base"
            >
              <ListMusic
                className={cn("w-5 h-5 mr-2", isInPlaylist && "text-primary")}
              />
              {isInPlaylist ? "In Playlist" : "Add to Playlist"}
            </Button>
          </div>
        </div>
        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 mt-8 lg:mt-0 space-y-8">
          <div>
            <h2 className="font-satoshi text-5xl font-extrabold">
              {project.title}
            </h2>
            <p className="mt-2 text-lg">
              by{" "}
              <span className="text-primary font-semibold">
                {project.stageName}
              </span>
            </p>
          </div>

          <Card>
            <CardHeader className="items-center">
              <CardTitle>Pulse Score Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center overflow-hidden">
              <PulseScoreOrbital project={project} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <div key={r.id} className="bg-background p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">{r.fanName}</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < r.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted mt-1">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted text-center">
                    Be the first to leave a review!
                  </p>
                )}
              </div>
              <form
                onSubmit={handleAddReview}
                className="mt-6 border-t border-border pt-4"
              >
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-sm font-bold">Your Rating:</span>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 cursor-pointer ${
                        i < newRating
                          ? "fill-primary text-primary"
                          : "text-muted hover:text-primary"
                      }`}
                      onClick={() => setNewRating(i + 1)}
                    />
                  ))}
                </div>
                <div className="relative">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute bottom-2 right-2"
                  >
                    Post <Send className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
