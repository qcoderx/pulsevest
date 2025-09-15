"use client";

import { useState, useRef, useEffect } from "react";
import { LiveProject, FanProfile } from "@/types";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider"; // Assuming a Slider component exists
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  ListMusic,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PlaylistViewProps {
  projects: LiveProject[];
  profile: FanProfile;
}

export function PlaylistView({ projects, profile }: PlaylistViewProps) {
  const [activeTab, setActiveTab] = useState<"audio" | "video">("audio");

  const audioPlaylist = projects.filter(
    (p) => profile.playlist.includes(p.id) && p.mediaType === "audio"
  );
  const videoPlaylist = projects.filter(
    (p) => profile.playlist.includes(p.id) && p.mediaType === "video"
  );

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("all");

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = audioPlaylist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTimes = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };
    const handleEnded = () => playNext();

    audio.addEventListener("timeupdate", updateTimes);
    audio.addEventListener("loadedmetadata", updateTimes);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTimes);
      audio.removeEventListener("loadedmetadata", updateTimes);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex, isShuffle, repeatMode]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current
        ?.play()
        .catch((e) => console.error("Playback failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const playNext = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * audioPlaylist.length);
    } else {
      nextIndex = currentTrackIndex + 1;
    }
    if (nextIndex >= audioPlaylist.length) {
      if (repeatMode === "all") {
        setCurrentTrackIndex(0);
      } else {
        setIsPlaying(false); // Stop if it's the end of the playlist
      }
    } else {
      setCurrentTrackIndex(nextIndex);
    }
  };

  const playPrev = () => {
    let prevIndex = isShuffle
      ? Math.floor(Math.random() * audioPlaylist.length)
      : currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = audioPlaylist.length - 1; // Loop back
    }
    setCurrentTrackIndex(prevIndex);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex space-x-2 border-b border-border mb-8">
        <Button
          variant={activeTab === "audio" ? "default" : "ghost"}
          onClick={() => setActiveTab("audio")}
        >
          Music
        </Button>
        <Button
          variant={activeTab === "video" ? "default" : "ghost"}
          onClick={() => setActiveTab("video")}
        >
          Films
        </Button>
      </div>

      {activeTab === "audio" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Audio Player */}
          <div className="lg:col-span-2 bg-card p-6 rounded-2xl">
            {currentTrack ? (
              <>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={currentTrack.imageUrl}
                    alt={currentTrack.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-2xl font-bold font-satoshi">
                    {currentTrack.title}
                  </h3>
                  <p className="text-muted">{currentTrack.creator}</p>
                </div>
                <div className="mt-4">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    onValueChange={(value) => {
                      if (audioRef.current)
                        audioRef.current.currentTime = value[0];
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={cn(isShuffle && "text-primary")}
                  >
                    <Shuffle className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={playPrev}>
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  <Button
                    size="icon"
                    className="w-16 h-16"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 fill-background" />
                    ) : (
                      <Play className="w-8 h-8 fill-background" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={playNext}>
                    <SkipForward className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setRepeatMode((prev) =>
                        prev === "none"
                          ? "all"
                          : prev === "all"
                          ? "one"
                          : "none"
                      )
                    }
                    className={cn(repeatMode !== "none" && "text-primary")}
                  >
                    <Repeat className="w-5 h-5" />
                    {repeatMode === "one" && (
                      <span className="absolute text-xs -top-1 -right-1">
                        1
                      </span>
                    )}
                  </Button>
                </div>
                <audio ref={audioRef} src={currentTrack.mediaUrl} />
              </>
            ) : (
              <p className="text-muted text-center py-20">
                Your music playlist is empty.
              </p>
            )}
          </div>
          {/* Audio Queue */}
          <div className="lg:col-span-1">
            <h3 className="font-satoshi text-xl font-bold mb-4">Up Next</h3>
            {/* ... Queue UI ... */}
          </div>
        </div>
      )}

      {activeTab === "video" && (
        <div>
          {videoPlaylist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Simplified video playlist view */}
              {videoPlaylist.map((video) => (
                <div key={video.id} className="bg-card p-4 rounded-lg">
                  <video
                    src={video.mediaUrl}
                    controls
                    className="w-full aspect-video rounded-md"
                  />
                  <h4 className="font-bold mt-2">{video.title}</h4>
                  <p className="text-sm text-muted">{video.creator}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center py-20">
              Your film playlist is empty.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
