// pulsevest/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider"; // Import the auth hook
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const backgroundImages = ["/pic1.png", "/pic2.png", "/pic3.png", "/pic4.png"];

export default function WelcomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // This effect handles the automatic redirection
  useEffect(() => {
    if (!isLoading && user) {
      // This is a simplified role detection. In a real app, you'd store the role
      // in Firebase Custom Claims or your database upon signup.
      // For now, we'll make an educated guess.
      // You can replace this with a more robust role-checking logic later.
      const lastPath = localStorage.getItem("last_known_role") || "fan";
      router.push(`/${lastPath}/dashboard`);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Don't render the welcome page content if a user is logged in and is being redirected.
  if (isLoading || user) {
    return null; // Or a loading spinner
  }

  return (
    <main className="relative flex items-center justify-center h-screen overflow-hidden">
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
            priority={index === 0}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 bg-black/60"></div>

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
