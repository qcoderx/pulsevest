// pulsevest/app/fan/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, LogOut, RefreshCw } from "lucide-react"; // Import RefreshCw icon
import { ProjectCard } from "@/components/investor/ProjectCard";
import { FanProjectView } from "@/components/fan/FanProjectView";
import { PlaylistView } from "@/components/fan/PlaylistView";
import { LiveProject, FanProfile } from "@/types";
import { Button } from "@/components/ui/Button";

type FanView = "all" | "favorites" | "playlist" | "detail";

export default function FanDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<FanView>("all");
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<LiveProject | null>(
    null
  );
  const [profile, setProfile] = useState<FanProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- THIS IS THE FIX ---
  // We've wrapped the fetching logic in a useCallback hook
  // so we can call it manually with the refresh button.
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const projectsResponse = await fetch("/api/projects/all");
      if (!projectsResponse.ok) throw new Error("Failed to fetch projects");
      const projectsData = await projectsResponse.json();
      if (projectsData.projects) setProjects(projectsData.projects);
    } catch (err) {
      console.error("Failed to fetch projects from API:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      await fetchProjects(); // Call the main fetch function

      if (user) {
        try {
          const storedProfile = localStorage.getItem(
            `pulsevest_fan_profile_${user.uid}`
          );
          let fanProfile;
          if (storedProfile) {
            fanProfile = JSON.parse(storedProfile);
          } else {
            fanProfile = {
              uid: user.uid,
              name: user.displayName || "Fan",
              pulsePoints: 100,
              favorites: [],
              following: [],
              playlist: [],
            };
            localStorage.setItem(
              `pulsevest_fan_profile_${user.uid}`,
              JSON.stringify(fanProfile)
            );
          }
          if (!fanProfile.playlist) fanProfile.playlist = [];
          setProfile(fanProfile);
        } catch (error) {
          console.error("Failed to parse profile from localStorage", error);
        }
      }
    }
    fetchData();
  }, [user, fetchProjects]);

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
    setView("detail");
    window.scrollTo(0, 0);
  };

  const handleBackToDiscovery = () => {
    setSelectedProject(null);
    setView("all");
  };

  const updateProfile = (updatedProfile: FanProfile) => {
    if (!user) return;
    setProfile(updatedProfile);
    localStorage.setItem(
      `pulsevest_fan_profile_${user.uid}`,
      JSON.stringify(updatedProfile)
    );
  };

  const handleToggleFavorite = (projectId: string) => {
    if (!profile) return;
    const newFavorites = profile.favorites.includes(projectId)
      ? profile.favorites.filter((id) => id !== projectId)
      : [...profile.favorites, projectId];
    updateProfile({ ...profile, favorites: newFavorites });
  };

  const handleTogglePlaylist = (projectId: string) => {
    if (!profile) return;
    const newPlaylist = profile.playlist.includes(projectId)
      ? profile.playlist.filter((id) => id !== projectId)
      : [...profile.playlist, projectId];
    updateProfile({ ...profile, playlist: newPlaylist });
  };

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
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-satoshi text-4xl font-bold">The Pulse</h1>
          <p className="text-muted mt-1">
            Discover the heartbeat of African creativity.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-satoshi text-2xl font-bold text-primary">
              {profile?.pulsePoints.toLocaleString() || 0}
            </p>
            <p className="text-xs text-muted">PulsePoints</p>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="icon">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex justify-between items-center border-b border-border mb-8">
        <div className="flex space-x-2">
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
        {/* --- REFRESH BUTTON ADDED HERE --- */}
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
