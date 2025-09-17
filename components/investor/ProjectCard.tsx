import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { LiveProject } from "@/types"; // We now import the master blueprint

// --- THIS INTERFACE IS NOW CORRECT AND ALIGNED ---
// It accepts a subset of the LiveProject data, with 'id' correctly as a string.
interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    creator: string;
    imageUrl: string;
    pulseScore: number;
    current: number;
    goal: number;
  };
  onSelect: () => void;
}

/**
 * The primary component for displaying a project.
 * Re-engineered to work with the final LiveProject data structure.
 */
export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const fundingPercentage =
    project.goal > 0 ? (project.current / project.goal) * 100 : 0;

  return (
    <div onClick={onSelect} className="cursor-pointer group">
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/50"
        )}
      >
        <div className="relative h-96 w-full">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute top-4 right-4 bg-background/70 backdrop-blur-sm rounded-full p-2 flex items-center space-x-2 z-10">
            <span className="font-bold font-satoshi text-sm text-primary">
              {project.pulseScore}
            </span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
          <div className="absolute bottom-0 left-0 p-4 z-10">
            <h3 className="font-satoshi text-2xl font-bold">{project.title}</h3>
            <p className="text-sm text-muted">{project.creator}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-muted">Raised</span>
            <span className="font-bold text-foreground">
              {fundingPercentage.toFixed(0)}%
            </span>
          </div>
          <ProgressBar value={fundingPercentage} />
        </CardContent>
      </Card>
    </div>
  );
}
