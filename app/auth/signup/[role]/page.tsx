"use client"; // This is crucial for using hooks like useRouter

import Link from "next/link";
import { useRouter } from "next/navigation"; // Import the router
import { use } from "react"; // Import the 'use' hook
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

// The 'params' prop is now typed as a Promise, as the warning suggests
export default function SignupPage({
  params,
}: {
  params: Promise<{ role: "creator" | "investor" }>;
}) {
  const resolvedParams = use(params); // Unwrap the promise with the 'use' hook
  const router = useRouter(); // Initialize the router
  const isCreator = resolvedParams.role === "creator"; // Use the unwrapped params
  const title = isCreator ? "Creator Signup" : "Investor Signup";
  const description = isCreator
    ? "Create your account to start funding your vision."
    : "Join to discover and invest in amazing projects.";

  // This function will handle the form submission and redirect
  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the page from reloading

    // In a real app, you would handle the signup logic here (e.g., API call)

    // Determine the destination and redirect
    const destination = isCreator
      ? "/creator/dashboard"
      : "/investor/dashboard";
    router.push(destination);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="font-satoshi text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* We attach our new handler to the form's onSubmit event */}
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
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
            {/* The button's type="submit" will trigger the form's onSubmit */}
            <Button type="submit" className="w-full mt-4 !h-12 text-base">
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            {/* Use the unwrapped params for the link as well */}
            <Link
              href={`/auth/login/${resolvedParams.role}`}
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
