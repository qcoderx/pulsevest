import Image from "next/image";

// This interface needs to be compatible with both LiveProject and the mock data
interface Project {
  title: string;
  imageUrl: string;
  mediaUrl?: string;
  mediaType?: "video" | "audio";
}

interface MediaViewerProps {
  project: Project;
}

/**
 * The emotional core of the project page.
 * Re-engineered to correctly display a video player OR an audio player.
 */
export function MediaViewer({ project }: MediaViewerProps) {
  // --- VIDEO LOGIC ---
  if (project.mediaType === "video" && project.mediaUrl) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
        <video
          src={project.mediaUrl}
          controls
          className="w-full h-full object-cover"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // --- AUDIO LOGIC ---
  if (project.mediaType === "audio" && project.mediaUrl) {
    return (
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black shadow-lg relative">
        {/* The cover image serves as the beautiful background */}
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover opacity-60"
        />
        {/* The audio player is elegantly overlaid at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm">
          <audio
            src={project.mediaUrl}
            controls
            className="w-full"
            preload="metadata"
          />
        </div>
      </div>
    );
  }

  // --- FALLBACK LOGIC ---
  // If no media is available, it gracefully falls back to just the cover image.
  return (
    <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden shadow-lg">
      <Image
        src={project.imageUrl}
        alt={project.title}
        fill
        className="object-cover"
      />
    </div>
  );
}
