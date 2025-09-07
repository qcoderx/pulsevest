"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BarChart2,
  Clock,
  Loader2,
  Paperclip,
  TrendingUp,
  UploadCloud,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { StatCard } from "@/components/creator/StatCard";

type View = "dashboard" | "creation" | "loading" | "results";

export default function CreatorDashboard() {
  const [view, setView] = useState<View>("dashboard");
  const [activeTab, setActiveTab] = useState("updates");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert("Please upload a creative asset before submitting.");
      return;
    }
    setView("loading");
    setTimeout(() => {
      setView("results");
    }, 3000);
  };

  const handleGoLive = () => {
    alert("Your project is now live on PulseVest!");
    setUploadedFile(null); // Reset file state
    setView("dashboard");
  };

  const handleStartNewProject = () => {
    setUploadedFile(null); // Reset file state for new project
    setView("creation");
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

      {view === "dashboard" && (
        <div className="animate-fade-in">
          <div className="mb-6">
            <h2 className="font-satoshi text-3xl font-bold">
              Campaign Dashboard:{" "}
              <span className="text-foreground">Eko Cyber</span>
            </h2>
            <p className="text-muted mt-1">
              Your masterpiece is 72% funded. Keep the momentum going!
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Raised"
              value="₦180,500"
              icon={<TrendingUp />}
            />
            <StatCard title="Investors" value="1,204" icon={<Users />} />
            <StatCard title="Days Left" value="12" icon={<Clock />} />
            <StatCard
              title="Pulse Score"
              value="82"
              icon={<BarChart2 />}
              variant="primary"
            />
          </div>
          <Card>
            <div className="flex border-b border-border p-2">
              <button
                onClick={() => setActiveTab("updates")}
                className={`font-semibold py-2 px-4 rounded-md ${
                  activeTab === "updates"
                    ? "bg-accent text-primary"
                    : "text-muted hover:bg-accent"
                }`}
              >
                Updates
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`font-semibold py-2 px-4 rounded-md ${
                  activeTab === "insights"
                    ? "bg-accent text-primary"
                    : "text-muted hover:bg-accent"
                }`}
              >
                Insights
              </button>
            </div>
            <CardContent className="p-6">
              {activeTab === "updates" && (
                <div>
                  <textarea
                    className="w-full bg-background border border-input rounded-md p-2 mb-4"
                    rows={4}
                    placeholder="Share your progress..."
                  ></textarea>
                  <div className="flex justify-end">
                    <Button>Post Update</Button>
                  </div>
                </div>
              )}
              {activeTab === "insights" && (
                <div>
                  <h3 className="font-satoshi text-xl font-bold mb-4">
                    Investor Insights
                  </h3>
                  {/* ... Insight content ... */}
                </div>
              )}
            </CardContent>
          </Card>
          <button
            onClick={handleStartNewProject}
            className="mt-8 w-full text-center py-4 border-2 border-dashed border-muted rounded-xl text-muted hover:border-primary hover:text-primary transition-colors"
          >
            + Create New Project
          </button>
        </div>
      )}

      {view === "creation" && (
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
            Let&#39;s bring your idea to life, step by step.
          </p>
          <form className="space-y-8 mt-8" onSubmit={handleAnalyze}>
            <Card>
              <CardHeader>
                <CardTitle>1. The Core Idea</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input placeholder="Project Title (e.g., Eko Cyber)" required />
                <Input placeholder="Category (e.g., Sci-Fi Film)" required />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2. The Financials</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input type="number" placeholder="Funding Goal (₦)" required />
                <Input type="date" required />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>3. The Creative Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md hover:border-primary transition-colors">
                    <div className="space-y-1 text-center">
                      {uploadedFile ? (
                        <>
                          <Paperclip className="mx-auto h-12 w-12 text-primary" />
                          <p className="font-semibold text-foreground">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-muted">
                            ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="mx-auto h-12 w-12 text-muted" />
                          <p className="text-sm text-muted">
                            <span className="font-semibold text-primary">
                              Click to upload
                            </span>{" "}
                            your script, demo, or pitch deck
                          </p>
                          <p className="text-xs text-muted">
                            PDF, MP3, MP4, MOV up to 500MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </Label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </CardContent>
            </Card>
            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="!text-lg">
                Submit for AI Analysis
              </Button>
            </div>
          </form>
        </div>
      )}

      {view === "loading" && (
        <div className="text-center py-20 animate-fade-in">
          <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
          <h3 className="font-satoshi text-2xl font-bold mt-6">
            Analyzing Your Masterpiece...
          </h3>
          <p className="text-muted mt-2">
            Our AI is reviewing your assets to calculate your Pulse Score.
          </p>
        </div>
      )}

      {view === "results" && (
        <div className="p-8 animate-fade-in bg-card border border-border rounded-2xl">
          <div className="text-center">
            <h3 className="font-satoshi text-xl font-bold mb-2 text-primary">
              Pulse Score Calculated!
            </h3>
            <p className="font-satoshi text-8xl font-extrabold text-foreground">
              82
            </p>
            <p className="text-muted mt-2 max-w-md mx-auto">
              This score reflects your project&#39;s potential based on our
              analysis.
            </p>
          </div>
          <div className="mt-8 border-t border-border pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted">Creative Analysis</span>
              <span className="font-bold text-lg">91</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Market Fit</span>
              <span className="font-bold text-lg">85</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Team Pedigree</span>
              <span className="font-bold text-lg">78</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button onClick={handleGoLive} size="lg" className="!text-lg">
              Go Live!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
