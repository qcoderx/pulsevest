// pulsevest/components/investor/PulseScoreOrbital.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Score } from "@/types";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";

interface Project {
  pulseScore: number;
  scores?: Score[];
  mediaType?: "audio" | "video";
}

interface PulseScoreOrbitalProps {
  project: Project;
}

export function PulseScoreOrbital({ project }: PulseScoreOrbitalProps) {
  const [rotation, setRotation] = useState(0);
  const [activeNode, setActiveNode] = useState<Score | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const animate = (time: number) => {
      setRotation(time / 100);
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
    const searchTerm = category.toLowerCase().replace(/\s/g, "");
    const scoreObj = project.scores.find((s) =>
      s.category.toLowerCase().replace(/\s/g, "").includes(searchTerm)
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
        { data: findScoreObject("lyricalcontent"), label: "Lyrics", angle: 90 },
        { data: findScoreObject("market"), label: "Market", angle: 180 },
      ];

  const radius = 120;
  const planetSize = "w-24 h-24";
  const sunSize = "w-32 h-32";
  const orbitalSize = "w-72 h-72";

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-8 w-full">
      <div className={cn("relative flex-shrink-0", orbitalSize)}>
        <div
          className={cn(
            "absolute inset-0 m-auto z-10 rounded-full flex flex-col items-center justify-center border-2 border-white/20 shadow-2xl shadow-secondary/30 bg-secondary",
            sunSize
          )}
        >
          <span className="font-satoshi text-5xl font-extrabold">
            {project.pulseScore ? Math.round(project.pulseScore) : "--"}
          </span>
          <span className="text-xs text-white/70 tracking-widest">OVERALL</span>
        </div>
        <div className="w-full h-full">
          {nodes.map((node, index) => {
            const currentAngle = node.angle + rotation;
            const angleRad = (currentAngle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
                onMouseEnter={() => setActiveNode(node.data)}
                onMouseLeave={() => setActiveNode(null)}
                onClick={() => setActiveNode(node.data)}
              >
                <div
                  className={cn(
                    "bg-card border border-border rounded-full flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110 hover:border-primary shadow-lg",
                    planetSize
                  )}
                  style={{ transform: `rotate(${-rotation}deg)` }}
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
      {/* --- THIS IS THE FIX --- */}
      {/* Increased width and height for more space */}
      <div className="w-full lg:w-80 mt-8 lg:mt-0 h-48 lg:h-40">
        <Card
          className={cn(
            "h-full transition-all duration-300 flex flex-col justify-center text-center",
            activeNode ? "opacity-100 scale-100" : "opacity-50 scale-95"
          )}
        >
          <CardContent className="p-6">
            {activeNode ? (
              <div className="animate-fade-in">
                <h4 className="font-satoshi font-bold text-lg text-primary">
                  {activeNode.category}
                </h4>
                <p className="text-sm text-foreground mt-2">
                  {activeNode.explanation}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted">
                Tap or hover over a score to see the AI&apos;s analysis.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
