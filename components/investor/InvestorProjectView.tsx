"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
// This is the same, shared interface from the creator's side
import { LiveProject } from "@/app/creator/dashboard/page";
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
  onInvest: () => void; // A simple function to open the modal
}

export function InvestorProjectView({
  project,
  onBack,
  onInvest,
}: InvestorProjectViewProps) {
  const fundingPercentage = (project.current / project.fundingGoal) * 100;

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
        {/* LEFT COLUMN: THE ART */}
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
        {/* RIGHT COLUMN: THE DATA */}
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
        </div>
      </div>
    </div>
  );
}
