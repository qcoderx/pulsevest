"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProjectCard } from "@/components/investor/ProjectCard";
import { InvestmentModal } from "@/components/investor/InvestmentModal";
import { InvestorProjectView } from "@/components/investor/InvestorProjectView";
// --- THIS IS THE CRITICAL FIX: We now import the single, definitive project type ---
import { LiveProject } from "@/app/creator/dashboard/page";

export default function InvestorDashboard() {
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<LiveProject | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- THE DEFINITIVE LOCALSTORAGE ENGINE ---
  useEffect(() => {
    setIsLoading(true);
    // We only access localStorage on the client-side to avoid server-side errors
    try {
      const storedProjects = localStorage.getItem("pulsevest_projects");
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects).reverse()); // .reverse() shows newest projects first
      }
    } catch (error) {
      console.error("Failed to parse projects from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const handleSelectProject = (project: LiveProject) => {
    setSelectedProject(project);
    window.scrollTo(0, 0); // Scroll to top for a smooth transition
  };

  const handleBackToDiscovery = () => setSelectedProject(null);

  // --- RENDER THE CORRECT VIEW ---
  // If a project is selected, we show the detailed view.
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

  // --- RENDER THE DISCOVERY GRID ---
  // This is the default view when no project is selected.
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
              // Adapt the LiveProject data to fit the props expected by ProjectCard
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
