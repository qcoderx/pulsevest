// pulsevest/app/investor/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProjectCard } from "@/components/investor/ProjectCard";
import { InvestmentModal } from "@/components/investor/InvestmentModal";
import { InvestorProjectView } from "@/components/investor/InvestorProjectView";
import { LiveProject } from "@/types";

export default function InvestorDashboard() {
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<LiveProject | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- THIS IS THE DEFINITIVE FIX ---
  // We now fetch from the database API instead of localStorage.
  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/projects/all");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        if (data.projects) {
          setProjects(data.projects); // Newest projects are already first from the API
        }
      } catch (error) {
        console.error("Failed to fetch projects from API:", error);
      }
      setIsLoading(false);
    }

    fetchProjects();
  }, []);

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
      <header className="mb-8">
        <h1 className="font-satoshi text-4xl font-bold">
          Discover a Masterpiece
        </h1>
        <p className="text-muted mt-1">
          Invest in the future of African creativity.
        </p>
      </header>
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
          <h3 className="font-satoshi text-2yl font-bold">
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
