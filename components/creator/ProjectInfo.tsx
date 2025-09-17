"use client";

import { useState } from "react";
import { ArrowLeft, Edit, Save, Sparkles, Trash2, X } from "lucide-react";
import { LiveProject } from "@/types";
import { MediaViewer } from "@/components/investor/MediaViewer";
import { PulseScoreOrbital } from "@/components/investor/PulseScoreOrbital";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { ProgressBar } from "../ui/ProgressBar";

interface ProjectInfoProps {
  project: LiveProject;
  onBack: () => void;
  onSave: (updatedProject: LiveProject) => void;
  // --- THIS IS THE DEFINITIVE FIX: The ID is now correctly a string ---
  onDelete: (projectId: string) => void;
}

export function ProjectInfo({
  project,
  onBack,
  onSave,
  onDelete,
}: ProjectInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Local state for the edit form
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [fundingGoal, setFundingGoal] = useState(String(project.fundingGoal));
  const [fundingReason, setFundingReason] = useState(project.fundingReason);

  const handleSaveChanges = () => {
    const updatedProject: LiveProject = {
      ...project,
      title,
      description,
      fundingGoal: Number(fundingGoal),
      fundingReason,
    };
    onSave(updatedProject);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${project.title}"? This action cannot be undone.`
      )
    ) {
      onDelete(project.id);
    }
  };

  const fundingPercentage =
    project.fundingGoal > 0 ? (project.current / project.fundingGoal) * 100 : 0;

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>
      <div className="lg:grid lg:grid-cols-5 lg:gap-12">
        {/* LEFT COLUMN: THE ART */}
        <div className="lg:col-span-2">
          <MediaViewer project={project} />
          <div className="mt-6 flex space-x-2">
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
            )}
            {isEditing && (
              <Button onClick={handleSaveChanges} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
            {isEditing && (
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="mt-2 w-full text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Project
          </Button>
        </div>
        {/* RIGHT COLUMN: THE DATA */}
        <div className="lg:col-span-3 mt-8 lg:mt-0 space-y-8">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Editing Project Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-4xl font-extrabold font-satoshi h-auto p-0 border-0 bg-transparent"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project description..."
                  className="text-lg min-h-[120px]"
                />
              </CardContent>
            </Card>
          ) : (
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
          )}

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
                {isEditing ? (
                  <Input
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    type="number"
                    className="w-32 h-8 text-right"
                  />
                ) : (
                  <span>
                    Goal:{" "}
                    <span className="font-bold">
                      ₦{project.fundingGoal.toLocaleString()}
                    </span>
                  </span>
                )}
              </div>
              <CardDescription className="mt-4">
                {isEditing ? (
                  <Textarea
                    value={fundingReason}
                    onChange={(e) => setFundingReason(e.target.value)}
                    placeholder="Reason for funding..."
                    className="min-h-[100px]"
                  />
                ) : (
                  project.fundingReason
                )}
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
