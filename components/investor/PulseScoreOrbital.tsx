"use client";

import React, { useState, useEffect } from "react";
// --- This is the definitive import from your master blueprint ---
import { Score } from "@/types";
import { cn } from "@/lib/utils";

interface Project {
  pulseScore: number;
  scores?: Score[];
  mediaType?: "audio" | "video";
}

interface PulseScoreOrbitalProps {
  project: Project;
}

/**
 * A dynamic, multimodal, orbiting visualization of the Pulse Score.
 * Re-engineered with stable, non-rotating text and a single, fixed tooltip area.
 */
export function PulseScoreOrbital({ project }: PulseScoreOrbitalProps) {
  const radius = 140;
  const [rotation, setRotation] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<Score | null>(null);

  // This effect creates a smooth, continuous rotation for the planet positions
  useEffect(() => {
    let animationFrameId: number;
    const animate = (time: number) => {
      setRotation(time / 100); // Control rotation speed
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const findScoreObject = (category: string): Score => {
    const defaultScore = {
      category,
      score: 0,
      explanation: "Analysis for this category was not available.",
    };
    if (!project.scores || !Array.isArray(project.scores)) return defaultScore;
    const searchTerm = category.toLowerCase();
    const scoreObj = project.scores.find((s) =>
      s.category.toLowerCase().includes(searchTerm)
    );
    return scoreObj || defaultScore;
  };

  const isVideo = project.mediaType === "video";
  const nodes = isVideo
    ? [
        { data: findScoreObject("storyline"), label: "Story", angle: -90 },
        { data: findScoreObject("acting"), label: "Acting", angle: 0 },
        {
          data: findScoreObject("cinematography"),
          label: "Visuals",
          angle: 90,
        },
        { data: findScoreObject("market"), label: "Potential", angle: 180 },
      ]
    : [
        { data: findScoreObject("rhythm"), label: "Rhythm", angle: -90 },
        { data: findScoreObject("sound"), label: "Sound", angle: 0 },
        { data: findScoreObject("market"), label: "Market", angle: 90 },
        { data: findScoreObject("genre"), label: "Genre", angle: 180 },
      ];

  return (
    <div className="flex items-center justify-center space-x-8">
      {/* Main Orbital System */}
      <div className="relative w-80 h-80 flex-shrink-0">
        {/* The Sun: Central Pulse Score */}
        <div className="absolute inset-0 m-auto z-10 w-40 h-40 bg-secondary rounded-full flex flex-col items-center justify-center border-2 border-white/20 shadow-2xl shadow-secondary/30">
          <span className="font-satoshi text-6xl font-extrabold">
            {project.pulseScore ? Math.round(project.pulseScore) : "--"}
          </span>
          <span className="text-sm text-white/70 tracking-widest">OVERALL</span>
        </div>

        {/* The Revolving container for the planets */}
        <div className="w-full h-full">
          {nodes.map((node, index) => {
            const currentAngle = node.angle + rotation;
            const angleRad = (currentAngle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
                onMouseEnter={() => setHoveredNode(node.data)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* The Planet: This circle counter-rotates its content to keep it stable */}
                <div
                  className="w-28 h-28 bg-card border border-border rounded-full flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110 hover:border-primary shadow-lg"
                  style={{ transform: `rotate(${-rotation}deg)` }} // The counter-rotation magic
                >
                  <span className="font-satoshi text-3xl font-bold">
                    {node.data.score}
                  </span>
                  <span className="text-xs text-muted">{node.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Hover Box: A single, fixed tooltip area to the right */}
      <div className="relative w-64 h-48">
        <div
          className={cn(
            "absolute inset-0 p-4 bg-card border border-border rounded-lg shadow-2xl transition-all duration-300 flex flex-col justify-center",
            hoveredNode
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          {hoveredNode && (
            <div className="text-center animate-fade-in">
              <h4 className="font-satoshi font-bold text-lg text-primary">
                {hoveredNode.category}
              </h4>
              <p className="text-sm text-foreground mt-2">
                {hoveredNode.explanation}
              </p>
            </div>
          )}
        </div>
        {/* Placeholder to maintain layout when not hovered */}
        <div
          className={cn(
            "absolute inset-0 p-4 flex flex-col justify-center items-center text-center text-muted transition-opacity duration-300",
            hoveredNode ? "opacity-0" : "opacity-100"
          )}
        >
          <p className="text-sm">
            Hover over a score to see the AI&apos;s analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
