"use client"; // This must be a Client Component to use state and effects

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Define the array of background images located in your /public folder
const backgroundImages = ["/pic1.png", "/pic2.png", "/pic3.png", "/pic4.png"];

export default function WelcomePage() {
  // State to keep track of the currently displayed image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect hook to set up the timer for the slideshow
  useEffect(() => {
    // Set an interval that runs every 4 seconds (4000 milliseconds)
    const interval = setInterval(() => {
      // Update the current index, looping back to 0 if it reaches the end
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);

    // This is a crucial cleanup function.
    // It clears the interval when the component is unmounted to prevent memory leaks.
    return () => clearInterval(interval);
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <main className="relative flex items-center justify-center h-screen overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`PulseVest background slide ${index + 1}`}
            fill
            className={cn(
              "object-cover transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
            priority={index === 0} // Preload the first image for faster initial load
          />
        ))}
      </div>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-black/60"></div>

      {/* Content Layer */}
      <div className="relative z-20 text-center p-5">
        <h1 className="font-satoshi text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl animate-fade-in-up">
          The Heartbeat of Creativity
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-200 drop-shadow-xl max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
          PulseVest is the engine for Africa&#39;s cultural renaissance,
          connecting visionary artists with the capital to ignite their genius.
        </p>
        <div className="mt-8 animate-fade-in-up animation-delay-600">
          <Link href="/auth/role-select">
            <Button size="lg" className="h-14 text-lg">
              Enter PulseVest
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
