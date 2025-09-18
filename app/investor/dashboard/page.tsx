// pulsevest/app/investor/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, LogOut, RefreshCw } from "lucide-react";
import { ProjectCard } from "@/components/investor/ProjectCard";
import { InvestmentModal } from "@/components/investor/InvestmentModal";
import { InvestorProjectView } from "@/components/investor/InvestorProjectView";
import { LiveProject } from "@/types";
import { Button } from "@/components/ui/Button";

export default function InvestorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<LiveProject | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects/all");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects from API:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleSelectProject = (project: LiveProject) => {
    setSelectedProject(project);
    window.scrollTo(0, 0);
  };

  const handleBackToDiscovery = () => setSelectedProject(null);

  if (selectedProject) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <InvestorProjectView
            project={selectedProject}
            onBack={handleBackToDiscovery}
            onInvest={() => setIsModalOpen(true)}
          />
        </div>
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
        />
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-satoshi text-4xl font-bold">
            Discover a Masterpiece
          </h1>
          <p className="text-muted mt-1">
            Invest in the future of African creativity.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted hidden sm:block">
            {user?.displayName || user?.email}
          </span>
          <img
            src={user?.photoURL || "/placeholder-user.jpg"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <Button onClick={handleLogout} variant="ghost" size="icon">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>
      <div className="flex justify-end border-b border-border mb-8 pb-4">
        <Button
          onClick={fetchProjects}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{ ...project, goal: project.fundingGoal }}
              onSelect={() => handleSelectProject(project)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="font-satoshi text-2xl font-bold">
            The Marketplace is Open
          </h3>
          <p className="text-muted mt-2">
            No projects have gone live yet. The world awaits its first
            visionary.
          </p>
        </div>
      )}
    </div>
  );
}
