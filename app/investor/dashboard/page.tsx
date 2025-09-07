"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ProjectCard } from "@/components/investor/ProjectCard";
import { InvestmentModal } from "@/components/investor/InvestmentModal";
import { PulseScoreOrbital } from "@/components/investor/PulseScoreOrbital";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { MediaViewer } from "@/components/investor/MediaViewer";

// --- 1. DEFINE THE STRICT TYPE FIRST ---
// By defining the Project type here, we create a strict contract.
// Note that mediaType is now explicitly defined.
type Project = {
  id: number;
  title: string;
  creator: string;
  imageUrl: string;
  logline: string;
  pulseScore: number;
  current: number;
  goal: number;
  scores: { creative: number; market: number; team: number; social: number };
  mediaType?: "video" | "audio"; // This is the explicit, strict type
  mediaUrl?: string;
};

// --- 2. DECLARE THAT THE ARRAY CONFORMS TO THE STRICT TYPE ---
// We now tell TypeScript that our 'projects' array is an array of 'Project' objects.
// This enforces the rule on every single object inside the array.
const projects: Project[] = [
  {
    id: 1,
    title: "Eko Cyber",
    creator: "Jide Martins",
    imageUrl:
      "https://images.pexels.com/photos/1638336/pexels-photo-1638336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    logline:
      "In a futuristic Lagos, a brilliant hacker uncovers a corporate conspiracy that threatens the city's very foundation.",
    pulseScore: 82,
    current: 180500,
    goal: 250000,
    scores: { creative: 91, market: 85, team: 78, social: 70 },
    mediaType: "video",
    mediaUrl:
      "https://videos.pexels.com/video-files/853877/853877-hd_1280_720_24fps.mp4",
  },
  {
    id: 2,
    title: "Accra Grooves",
    creator: "Ama Serwa",
    imageUrl:
      "https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    logline:
      "A young highlife musician must find her voice to save her family's historic music club from developers.",
    pulseScore: 76,
    current: 45000,
    goal: 60000,
    scores: { creative: 88, market: 75, team: 70, social: 72 },
    mediaType: "audio",
    mediaUrl:
      "https://cdn.pixabay.com/download/audio/2022/08/23/audio_82c918c32b.mp3",
  },
  {
    id: 3,
    title: "Kinshasa Canvas",
    creator: "Didier Bokanga",
    imageUrl:
      "https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    logline:
      "An aging artist gets a final chance at fame, but must confront a secret from his past to complete his masterpiece.",
    pulseScore: 88,
    current: 22000,
    goal: 30000,
    scores: { creative: 95, market: 82, team: 89, social: 84 },
    mediaType: "video",
    mediaUrl:
      "https://videos.pexels.com/video-files/854251/854251-hd_1280_720_25fps.mp4",
  },
  {
    id: 4,
    title: "Nairobi Next",
    creator: "Wanjiru Githae",
    imageUrl:
      "https://images.pexels.com/photos/5083491/pexels-photo-5083491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    logline:
      "A group of tech entrepreneurs in Nairobi race against time to launch an app that could change the continent.",
    pulseScore: 91,
    current: 450000,
    goal: 500000,
    scores: { creative: 85, market: 95, team: 92, social: 90 },
    // This project has no media, so the MediaViewer will gracefully fallback to showing the image.
  },
];

export default function InvestorDashboard() {
  // State to manage which view is active: the main grid or a single project's detail page
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // State to control the visibility of the investment modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to set the selected project and switch to the detail view
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    window.scrollTo(0, 0); // Scroll to the top of the page for a smooth transition
  };

  // Function to clear the selected project and return to the discovery grid
  const handleBackToDiscovery = () => {
    setSelectedProject(null);
  };

  // --- RENDER THE PROJECT DETAIL VIEW ---
  // If a project has been selected, we render this detailed layout.
  if (selectedProject) {
    const fundingPercentage =
      (selectedProject.current / selectedProject.goal) * 100;
    return (
      <>
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <button
            onClick={handleBackToDiscovery}
            className="flex items-center space-x-2 text-muted hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Discovery</span>
          </button>
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Left Column: Media and Investment Actions */}
            <div className="lg:col-span-1">
              <MediaViewer project={selectedProject} />
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="mt-6 w-full !text-lg !py-7 font-bold"
              >
                Invest Now
              </Button>
              <div className="mt-4 text-center text-sm text-muted">
                Campaign ends in 12 days
              </div>
            </div>

            {/* Right Column: Project Details and Pulse Score */}
            <div className="lg:col-span-2 mt-8 lg:mt-0">
              <h2 className="font-satoshi text-5xl font-extrabold">
                {selectedProject.title}
              </h2>
              <p className="mt-2 text-lg">
                by{" "}
                <span className="text-primary font-semibold">
                  {selectedProject.creator}
                </span>
              </p>
              <div className="mt-6">
                <ProgressBar value={fundingPercentage} />
                <div className="flex justify-between mt-2 text-sm">
                  <span>
                    <span className="font-bold">
                      ₦{selectedProject.current.toLocaleString()}
                    </span>{" "}
                    raised
                  </span>
                  <span>
                    Goal:{" "}
                    <span className="font-bold">
                      ₦{selectedProject.goal.toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>
              <p className="mt-8 text-lg text-muted">
                {selectedProject.logline}
              </p>
              <div className="mt-12 flex flex-col items-center">
                <h3 className="font-satoshi text-xl font-bold mb-16 text-center">
                  Pulse Score
                </h3>
                <PulseScoreOrbital project={selectedProject} />
              </div>
            </div>
          </div>
        </div>

        {/* The Investment Modal, controlled by its own state */}
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
        />
      </>
    );
  }

  // --- RENDER THE DISCOVERY FEED VIEW ---
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={() => handleSelectProject(project)}
          />
        ))}
      </div>
    </div>
  );
}
