// pulsevest/app/auth/signup/[role]/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import your initialized auth instance
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function SignupPage({
  params,
}: {
  params: { role: "creator" | "investor" | "fan" };
}) {
  const router = useRouter();
  const { role } = params;

  // State to manage form inputs, loading, and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isCreator = role === "creator";
  const title = isCreator ? "Creator Signup" : "Investor Signup";
  const description = isCreator
    ? "Create your account to start funding your vision."
    : "Join to discover and invest in amazing projects.";

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use Firebase to create a new user!
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Firebase user created:", userCredential.user);

      // Redirect to the correct dashboard on success
      const destination = `/${role}/dashboard`;
      router.push(destination);
    } catch (err: any) {
      // Handle Firebase errors and show a user-friendly message
      console.error("Firebase Auth Error:", err);
      let errorMessage = "Failed to sign up. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use. Please log in.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="font-satoshi text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Ada Lovelace" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ada@pulsevest.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isCreator && (
              <div className="space-y-2">
                <Label htmlFor="discipline">Creative Discipline</Label>
                <Input
                  id="discipline"
                  placeholder="Filmmaker, Musician, etc."
                />
              </div>
            )}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full mt-4 !h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              href={`/auth/login/${role}`}
              className="underline text-primary"
            >
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
