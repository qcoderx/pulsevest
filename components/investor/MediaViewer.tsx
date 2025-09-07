import Image from "next/image";

type Project = {
  title: string;
  imageUrl: string;
  mediaUrl?: string;
  mediaType?: "video" | "audio";
};

interface MediaViewerProps {
  project: Project;
}

/**
 * The emotional core of the project page.
 * This component dynamically displays a video player, an audio player with a poster,
 * or a static image, based on the project's media assets.
 */
export function MediaViewer({ project }: MediaViewerProps) {
  if (project.mediaType === "video" && project.mediaUrl) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
        <video
          src={project.mediaUrl}
          controls
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (project.mediaType === "audio" && project.mediaUrl) {
    return (
      <div className="w-full rounded-2xl overflow-hidden bg-black shadow-lg relative">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm">
          <audio src={project.mediaUrl} controls className="w-full" />
        </div>
      </div>
    );
  }

  // Fallback to just showing the poster image if no media is available
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
