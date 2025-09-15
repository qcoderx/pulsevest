"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Loader2,
  ListMusic,
  Star,
  UserPlus,
} from "lucide-react";
import { ProjectCard } from "@/components/investor/ProjectCard";
import { FanProjectView } from "@/components/fan/FanProjectView";
import { PlaylistView } from "@/components/fan/PlaylistView";
import { LiveProject, FanProfile } from "@/types";
import { Button } from "@/components/ui/Button";

type FanView = "all" | "favorites" | "playlist" | "detail";

export default function FanDashboard() {
  const [view, setView] = useState<FanView>("all");
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<LiveProject | null>(
    null
  );
  const [profile, setProfile] = useState<FanProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- THE DEFINITIVE LOCALSTORAGE ENGINE ---
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedProjects = localStorage.getItem("pulsevest_projects");
      const storedProfile = localStorage.getItem("pulsevest_fan_profile");

      if (storedProjects) {
        setProjects(JSON.parse(storedProjects).reverse());
      }

      let fanProfile;
      if (storedProfile) {
        fanProfile = JSON.parse(storedProfile);
      } else {
        // Create a default profile if one doesn't exist
        fanProfile = {
          name: "AfrobeatLover9ja",
          pulsePoints: 100,
          favorites: [],
          following: [],
          playlist: [],
        };
        localStorage.setItem(
          "pulsevest_fan_profile",
          JSON.stringify(fanProfile)
        );
      }
      // Ensure profile has a playlist property for backward compatibility
      if (!fanProfile.playlist) {
        fanProfile.playlist = [];
      }
      setProfile(fanProfile);
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
    setIsLoading(false);
  }, [view]); // Refetch data whenever the main view changes to ensure it's up to date

  const handleSelectProject = (project: LiveProject) => {
    setSelectedProject(project);
    setView("detail");
    window.scrollTo(0, 0);
  };

  const handleBackToDiscovery = () => {
    setSelectedProject(null);
    setView("all"); // Always go back to the main discovery feed
  };

  // --- FAN-SPECIFIC ACTIONS ---
  const updateProfile = (updatedProfile: FanProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem(
      "pulsevest_fan_profile",
      JSON.stringify(updatedProfile)
    );
  };

  const handleToggleFavorite = (projectId: number) => {
    if (!profile) return;
    const newFavorites = profile.favorites.includes(projectId)
      ? profile.favorites.filter((id) => id !== projectId)
      : [...profile.favorites, projectId];
    updateProfile({ ...profile, favorites: newFavorites });
  };

  const handleTogglePlaylist = (projectId: number) => {
    if (!profile) return;
    const newPlaylist = profile.playlist.includes(projectId)
      ? profile.playlist.filter((id) => id !== projectId)
      : [...profile.playlist, projectId];
    updateProfile({ ...profile, playlist: newPlaylist });
  };

  // --- RENDER LOGIC ---
  // If a project is selected, we show the detailed view.
  if (view === "detail" && selectedProject && profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FanProjectView
          project={selectedProject}
          onBack={handleBackToDiscovery}
          isFavorite={profile.favorites.includes(selectedProject.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedProject.id)}
          isInPlaylist={profile.playlist.includes(selectedProject.id)}
          onTogglePlaylist={() => handleTogglePlaylist(selectedProject.id)}
        />
      </div>
    );
  }

  const favoriteProjects = projects.filter((p) =>
    profile?.favorites.includes(p.id)
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-satoshi text-4xl font-bold">The Pulse</h1>
          <p className="text-muted mt-1">
            Discover the heartbeat of African creativity.
          </p>
        </div>
        <div className="text-right">
          <p className="font-satoshi text-2xl font-bold text-primary">
            {profile?.pulsePoints.toLocaleString() || 0}
          </p>
          <p className="text-xs text-muted">PulsePoints</p>
        </div>
      </header>

      <div className="flex space-x-2 border-b border-border mb-8">
        <Button
          variant={view === "all" ? "default" : "ghost"}
          onClick={() => setView("all")}
        >
          All Projects
        </Button>
        <Button
          variant={view === "favorites" ? "default" : "ghost"}
          onClick={() => setView("favorites")}
        >
          Favorites
        </Button>
        <Button
          variant={view === "playlist" ? "default" : "ghost"}
          onClick={() => setView("playlist")}
        >
          Playlist
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-20">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
        </div>
      )}

      {!isLoading && view === "playlist" && profile && (
        <PlaylistView projects={projects} profile={profile} />
      )}

      {!isLoading && (view === "all" || view === "favorites") && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {(view === "all" ? projects : favoriteProjects).map((project) => (
              <ProjectCard
                key={project.id}
                project={{ ...project, goal: project.fundingGoal }}
                onSelect={() => handleSelectProject(project)}
              />
            ))}
          </div>
          {view === "all" && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted">No projects have gone live yet.</p>
            </div>
          )}
          {view === "favorites" && favoriteProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted">
                You haven&apos;t saved any favorites yet.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
