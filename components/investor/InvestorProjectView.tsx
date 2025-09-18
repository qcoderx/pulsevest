// pulsevest/components/investor/InvestorProjectView.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Sparkles, Star } from "lucide-react";
import { LiveProject, Review } from "@/types";
import { MediaViewer } from "@/components/investor/MediaViewer";
import { PulseScoreOrbital } from "@/components/investor/PulseScoreOrbital";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { ProgressBar } from "../ui/ProgressBar";

interface InvestorProjectViewProps {
  project: LiveProject;
  onBack: () => void;
  onInvest: () => void;
}

export function InvestorProjectView({
  project,
  onBack,
  onInvest,
}: InvestorProjectViewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);

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

  const fundingPercentage =
    project.fundingGoal > 0 ? (project.current / project.fundingGoal) * 100 : 0;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

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
          <Button
            onClick={onInvest}
            size="lg"
            className="mt-6 w-full !text-lg !py-7 font-bold"
          >
            Invest Now
          </Button>
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
            <p className="mt-8 text-lg text-muted">{project.description}</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Funding Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar value={fundingPercentage} />
              <div className="flex justify-between mt-2 text-sm">
                <span>
                  <span className="font-bold">
                    ₦{project.current.toLocaleString()}
                  </span>{" "}
                  raised
                </span>
                <span>
                  Goal:{" "}
                  <span className="font-bold">
                    ₦{project.fundingGoal.toLocaleString()}
                  </span>
                </span>
              </div>
              <CardDescription className="mt-4">
                {project.fundingReason}
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <CardTitle>Pulse Score Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center overflow-hidden">
              <PulseScoreOrbital project={project} />
            </CardContent>
            {project.suggestions && (
              <CardContent className="border-t border-border pt-6">
                <h4 className="font-satoshi font-bold text-lg mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" /> AI
                  Suggestions
                </h4>
                <p className="text-sm text-muted">{project.suggestions}</p>
              </CardContent>
            )}
          </Card>
          {/* --- REVIEWS SECTION ADDED FOR INVESTORS --- */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Fan Reviews ({reviews.length})</CardTitle>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-5 h-5 fill-primary" />
                    <span className="font-bold text-lg">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
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
                    No fan reviews yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
