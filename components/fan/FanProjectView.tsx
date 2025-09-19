"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Heart, ListMusic, Send, Star } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { LiveProject, Review, FanProfile } from "@/types";
import { MediaViewer } from "@/components/investor/MediaViewer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "../ui/Textarea";
import { cn } from "@/lib/utils";
import { PulseScoreOrbital } from "../investor/PulseScoreOrbital";

interface FanProjectViewProps {
  project: LiveProject;
  profile: FanProfile;
  onBack: () => void;
  onUpdateProfile: (updatedProfile: FanProfile) => void;
}

export function FanProjectView({
  project,
  profile,
  onBack,
  onUpdateProfile,
}: FanProjectViewProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFavorite = profile.favorites.includes(project.id);
  const isInPlaylist = profile.playlist.includes(project.id);

  const awardPulsePoints = useCallback(
    async (actionType: "favorite" | "playlist" | "review") => {
      if (!user) return;
      try {
        const response = await fetch("/api/pulse-points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fanId: user.uid,
            projectId: project.id,
            actionType,
          }),
        });
        const data = await response.json();
        if (data.pointsAwarded > 0) {
          onUpdateProfile({
            ...profile,
            pulsePoints: profile.pulsePoints + data.pointsAwarded,
          });
        }
      } catch (error) {
        console.error(`Failed to award points for ${actionType}:`, error);
      }
    },
    [user, project.id, profile, onUpdateProfile]
  );

  const handleToggleFavorite = () => {
    if (!user) return;
    const newFavorites = isFavorite
      ? profile.favorites.filter((id) => id !== project.id)
      : [...profile.favorites, project.id];

    onUpdateProfile({ ...profile, favorites: newFavorites });

    if (!isFavorite) {
      awardPulsePoints("favorite");
    }
  };

  const handleTogglePlaylist = () => {
    if (!user) return;
    const newPlaylist = isInPlaylist
      ? profile.playlist.filter((id) => id !== project.id)
      : [...profile.playlist, project.id];

    onUpdateProfile({ ...profile, playlist: newPlaylist });

    if (!isInPlaylist) {
      awardPulsePoints("playlist");
    }
  };

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/reviews/${project.id}`);
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  }, [project.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to leave a review.");
    if (!newComment || newRating === 0)
      return alert("Please provide a rating and a comment.");

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          fanId: user.uid,
          fanName: user.displayName || "Anonymous Fan",
          rating: newRating,
          comment: newComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review.");
      }

      await awardPulsePoints("review");

      setNewComment("");
      setNewRating(0);
      await fetchReviews();
    } catch (error) {
      console.error("Review submission error:", error);
      alert(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasUserReviewed = user
    ? reviews.some((review) => review.fanId === user.uid)
    : false;

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
        <div className="lg:col-span-2">
          <MediaViewer project={project} />
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button
              onClick={handleToggleFavorite}
              size="lg"
              className="!text-base"
            >
              <Heart
                className={cn(
                  "w-5 h-5 mr-2",
                  isFavorite && "fill-red-500 text-red-500"
                )}
              />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            <Button
              onClick={handleTogglePlaylist}
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
          <PulseScoreOrbital project={project} />
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <div
                      key={r._id?.toString() || r.id}
                      className="bg-background p-3 rounded-lg"
                    >
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
                {hasUserReviewed ? (
                  <p className="text-center text-sm text-primary font-semibold">
                    Thanks for your review!
                  </p>
                ) : (
                  <>
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Posting..."
                        ) : (
                          <>
                            Post <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
