import React from "react";

type Project = {
  pulseScore: number;
  scores: { creative: number; market: number; team: number; social: number };
};

interface PulseScoreOrbitalProps {
  project: Project;
}

/**
 * A dynamic, orbiting visualization of the Pulse Score,
 * representing the core score as a central sun and sub-scores as orbiting planets.
 */
export function PulseScoreOrbital({ project }: PulseScoreOrbitalProps) {
  const radius = 140; // The radius of the orbit in pixels

  const nodes = [
    { score: project.scores.creative, label: "Creative", angle: -90 }, // Top
    { score: project.scores.market, label: "Market", angle: 0 }, // Right
    { score: project.scores.team, label: "Team", angle: 90 }, // Bottom
    { score: project.scores.social, label: "Social", angle: 180 }, // Left
  ];

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* The Sun: Central Pulse Score */}
      <div className="absolute z-10 w-40 h-40 bg-secondary rounded-full flex flex-col items-center justify-center border-2 border-white/20 shadow-2xl shadow-secondary/30">
        <span className="font-satoshi text-6xl font-extrabold">
          {project.pulseScore}
        </span>
        <span className="text-sm text-white/70 tracking-widest">OVERALL</span>
      </div>

      {/* The Orbit Path (visual flair) */}
      <div className="absolute w-72 h-72 border border-dashed border-border rounded-full animate-spin-slow" />

      {/* The Planets Container: This is what rotates */}
      <div className="w-full h-full animate-spin-slow">
        {nodes.map((node, index) => {
          // Convert angle from degrees to radians for trigonometric functions
          const angleRad = (node.angle * Math.PI) / 180;
          // Calculate the x and y coordinates on the circle
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 w-28 h-28 bg-card border border-border rounded-full flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110 hover:border-primary shadow-lg"
              style={{
                // The transform places the element on its orbital path.
                // The first translate centers the element's anchor point.
                // The second translate moves it to the calculated (x, y) coordinate.
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              }}
            >
              <span className="font-satoshi text-3xl font-bold">
                {node.score}
              </span>
              <span className="text-xs text-muted">{node.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
