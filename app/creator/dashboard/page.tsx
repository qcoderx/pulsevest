"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BarChart2,
  Clock,
  FileAudio,
  Film,
  ImageIcon,
  Loader2,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { StatCard } from "@/components/creator/StatCard";
import { ProjectCard } from "@/components/investor/ProjectCard";
import { ProjectInfo } from "@/components/creator/ProjectInfo";
import { ProgressBar } from "@/components/ui/ProgressBar";
// --- THE CRITICAL FIX: We now import from the definitive types file ---
import { LiveProject, Score } from "@/types";

// The AnalysisResult is now defined locally as it's only used here
interface AnalysisResult {
  pulseScore: number;
  scores: Score[];
  suggestions: string;
}

type View = "dashboard" | "creation" | "loading" | "results" | "projectDetail";

export default function CreatorDashboard() {
  const [view, setView] = useState<View>("dashboard");
  const [liveProjects, setLiveProjects] = useState<LiveProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<LiveProject | null>(
    null
  );

  // Form State
  const [title, setTitle] = useState("");
  const [stageName, setStageName] = useState("");
  const [realName, setRealName] = useState("");
  const [description, setDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [fundingReason, setFundingReason] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Control State
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    if (view === "dashboard") {
      try {
        const storedProjects = JSON.parse(
          localStorage.getItem("pulsevest_projects") || "[]"
        );
        setLiveProjects(storedProjects.reverse());
      } catch (error) {
        console.error("Failed to load projects from localStorage", error);
      }
    }
  }, [view]);

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setMediaFile(e.target.files[0]);
  };
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCoverImage(e.target.files[0]);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile || !title || !stageName) {
      alert(
        "Please provide a Title, Stage Name, and a Media File to run the analysis."
      );
      return;
    }
    setIsLoading(true);
    setLoadingMessage("Contacting analysis engine...");
    setApiError(null);
    setAnalysisResult(null);
    try {
      const formData = new FormData();
      formData.append("audioFile", mediaFile);
      const backendUrl = "https://pulsevest-backend.onrender.com/analyze";
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Server responded with status ${response.status}`
        );
      }
      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      setView("results");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setApiError(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoLive = async () => {
    if (
      !analysisResult ||
      !mediaFile ||
      !coverImage ||
      !description ||
      !fundingGoal ||
      !fundingReason ||
      !realName
    ) {
      alert(
        "Please ensure all form fields, including the cover image, are complete before going live."
      );
      return;
    }
    setIsLoading(true);
    setLoadingMessage("Uploading media to Cloudinary...");
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append("mediaFile", mediaFile);
      formData.append("coverImage", coverImage);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Upload failed with status ${response.status}`
        );
      }
      const { mediaUrl, imageUrl } = await response.json();

      const newProject: LiveProject = {
        id: Date.now(),
        title,
        stageName,
        realName,
        description,
        fundingGoal: Number(fundingGoal),
        fundingReason,
        mediaUrl,
        imageUrl,
        mediaType: mediaFile.type.startsWith("video") ? "video" : "audio",
        createdAt: new Date().toISOString(),
        pulseScore: analysisResult.pulseScore,
        scores: analysisResult.scores,
        suggestions: analysisResult.suggestions,
        current: 0,
        creator: stageName,
      };
      const existingProjects = JSON.parse(
        localStorage.getItem("pulsevest_projects") || "[]"
      );
      existingProjects.push(newProject);
      localStorage.setItem(
        "pulsevest_projects",
        JSON.stringify(existingProjects)
      );

      alert(`SUCCESS! Your project "${title}" is now LIVE!`);
      setView("dashboard");
      setTitle("");
      setStageName("");
      setRealName("");
      setDescription("");
      setFundingGoal("");
      setFundingReason("");
      setMediaFile(null);
      setCoverImage(null);
      setAnalysisResult(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setApiError(`Failed to go live: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProjectChanges = (updatedProject: LiveProject) => {
    const existingProjects: LiveProject[] = JSON.parse(
      localStorage.getItem("pulsevest_projects") || "[]"
    );
    const projectIndex = existingProjects.findIndex(
      (p) => p.id === updatedProject.id
    );
    if (projectIndex > -1) {
      existingProjects[projectIndex] = updatedProject;
      localStorage.setItem(
        "pulsevest_projects",
        JSON.stringify(existingProjects)
      );
      alert("Changes saved!");
      setView("dashboard");
    }
  };

  const handleDeleteProject = (projectId: number) => {
    const existingProjects: LiveProject[] = JSON.parse(
      localStorage.getItem("pulsevest_projects") || "[]"
    );
    const updatedProjects = existingProjects.filter((p) => p.id !== projectId);
    localStorage.setItem("pulsevest_projects", JSON.stringify(updatedProjects));
    alert("Project deleted.");
    setView("dashboard");
  };

  const handleSelectProject = (project: LiveProject) => {
    setSelectedProject(project);
    setView("projectDetail");
  };

  const totalFunding = liveProjects.reduce((sum, p) => sum + p.current, 0);
  const avgPulseScore =
    liveProjects.length > 0
      ? (
          liveProjects.reduce((sum, p) => sum + p.pulseScore, 0) /
          liveProjects.length
        ).toFixed(0)
      : "--";

  const renderContent = () => {
    switch (view) {
      case "projectDetail":
        return selectedProject ? (
          <ProjectInfo
            project={selectedProject}
            onBack={() => setView("dashboard")}
            onSave={handleSaveProjectChanges}
            onDelete={handleDeleteProject}
          />
        ) : null;
      case "creation":
        return (
          <div className="animate-fade-in">
            <button
              onClick={() => setView("dashboard")}
              className="flex items-center space-x-2 text-muted hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h2 className="font-satoshi text-3xl font-bold">
              Launch Your Vision
            </h2>
            <p className="text-muted mt-1">
              First, fill in your details and upload your media file for
              analysis.
            </p>
            <form className="space-y-8 mt-8" onSubmit={handleAnalyze}>
              <Card>
                <CardHeader>
                  <CardTitle>1. The Creator</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    placeholder="Your Real Name"
                  />
                  <Input
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                    placeholder="Your Stage Name"
                    required
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>2. The Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project Title"
                    required
                  />
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description..."
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>3. The Financials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="number"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    placeholder="Funding Goal (₦)"
                  />
                  <Textarea
                    value={fundingReason}
                    onChange={(e) => setFundingReason(e.target.value)}
                    placeholder="Why you need this funding..."
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>4. The Creative Asset</CardTitle>
                  <CardDescription>
                    Your audio or video file (for analysis).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="media-file-upload" className="cursor-pointer">
                    <div className="mt-1 flex justify-center h-48 items-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md hover:border-primary">
                      <div className="space-y-1 text-center">
                        {mediaFile ? (
                          <>
                            {mediaFile.type.startsWith("audio") ? (
                              <FileAudio className="mx-auto h-12 w-12 text-primary" />
                            ) : (
                              <Film className="mx-auto h-12 w-12 text-primary" />
                            )}
                            <p className="font-semibold">{mediaFile.name}</p>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="mx-auto h-12 w-12 text-muted" />
                            <p className="text-sm">
                              <span className="font-semibold text-primary">
                                Click to upload media
                              </span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </Label>
                  <input
                    id="media-file-upload"
                    type="file"
                    accept="audio/*,video/*"
                    className="sr-only"
                    onChange={handleMediaFileChange}
                  />
                </CardContent>
              </Card>
              {apiError && (
                <p className="text-center text-red-500">{apiError}</p>
              )}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="!text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                      Analyzing...
                    </>
                  ) : (
                    "Get AI Pulse Score"
                  )}
                </Button>
              </div>
            </form>
          </div>
        );
      case "loading":
        return (
          <div className="text-center py-20 animate-fade-in">
            <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h3 className="font-satoshi text-2xl font-bold mt-6">
              {loadingMessage}
            </h3>
          </div>
        );
      case "results":
        return analysisResult ? (
          <div className="animate-fade-in">
            <h2 className="font-satoshi text-3xl font-bold">
              Analysis Complete!
            </h2>
            <p className="text-muted mt-1">
              Review your Pulse Score. Complete any remaining fields and Go
              Live!
            </p>
            <div className="p-8 mt-8 bg-card border border-border rounded-2xl">
              <div className="text-center">
                <h3 className="font-satoshi text-xl font-bold mb-2 text-primary">
                  Pulse Score Calculated!
                </h3>
                <p className="font-satoshi text-8xl font-extrabold text-foreground">
                  {Math.round(analysisResult.pulseScore)}
                </p>
              </div>
              <div className="mt-8 border-t border-border pt-6 space-y-6">
                {analysisResult.scores.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-satoshi font-bold text-lg">
                        {item.category}
                      </h4>
                      <span className="font-bold text-lg text-primary">
                        {item.score}
                      </span>
                    </div>
                    <ProgressBar value={item.score} />
                    <p className="text-sm text-muted mt-2">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <h4 className="font-satoshi font-bold text-lg mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" /> Suggestions
                </h4>
                <p className="text-sm text-muted">
                  {analysisResult.suggestions}
                </p>
              </div>
            </div>
            <div className="mt-8 text-center text-muted text-sm">
              To publish your project, please ensure all fields from the
              previous page are complete and upload a cover image below.
            </div>
            <div className="grid grid-cols-1 mt-4 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Cover Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label
                    htmlFor="cover-image-upload"
                    className="cursor-pointer"
                  >
                    <div className="mt-1 flex justify-center h-48 items-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md hover:border-primary">
                      <div className="space-y-1 text-center">
                        {coverImage ? (
                          <>
                            <ImageIcon className="mx-auto h-12 w-12 text-primary" />
                            <p className="font-semibold">{coverImage.name}</p>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="mx-auto h-12 w-12 text-muted" />
                            <p className="text-sm">
                              <span className="font-semibold text-primary">
                                Click to upload image
                              </span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </Label>
                  <input
                    id="cover-image-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleCoverImageChange}
                  />
                </CardContent>
              </Card>
            </div>
            {apiError && (
              <p className="text-center text-red-500 mt-4">{apiError}</p>
            )}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setView("creation");
                  setAnalysisResult(null);
                }}
              >
                Back to Edit
              </Button>
              <Button
                size="lg"
                className="!text-lg"
                onClick={handleGoLive}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Publishing...
                  </>
                ) : (
                  "Go Live!"
                )}
              </Button>
            </div>
          </div>
        ) : null;
      case "dashboard":
      default:
        return (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="font-satoshi text-3xl font-bold">
                Your Campaign Dashboard
              </h2>
              <p className="text-muted mt-1">Manage your active campaigns.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Raised"
                value={`₦${totalFunding.toLocaleString()}`}
                icon={<TrendingUp />}
              />
              <StatCard title="Investors" value="0" icon={<Users />} />
              <StatCard
                title="Live Projects"
                value={liveProjects.length}
                icon={<Clock />}
              />
              <StatCard
                title="Avg. Pulse Score"
                value={avgPulseScore}
                icon={<BarChart2 />}
                variant="primary"
              />
            </div>
            <div className="mt-8">
              <h3 className="font-satoshi text-2xl font-bold">
                Your Live Projects
              </h3>
              {liveProjects.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveProjects.map((p) => (
                    <div
                      key={p.id}
                      className="cursor-pointer"
                      onClick={() => handleSelectProject(p)}
                    >
                      <ProjectCard
                        project={{ ...p, goal: p.fundingGoal }}
                        onSelect={() => {}}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">You have no live projects yet.</p>
              )}
            </div>
            <button
              onClick={() => setView("creation")}
              className="mt-8 w-full text-center py-4 border-2 border-dashed border-muted rounded-xl text-muted hover:border-primary hover:text-primary transition-colors"
            >
              + Create New Project
            </button>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="font-satoshi text-2xl sm:text-3xl font-bold text-primary">
          PulseVest Creator Hub
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted hidden sm:block">
            Jide Martins
          </span>
          <img
            src="https://i.pravatar.cc/150?u=jide"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>
      {renderContent()}
    </div>
  );
}
