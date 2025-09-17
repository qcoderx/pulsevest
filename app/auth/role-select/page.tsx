// pulsevest/app/auth/role-select/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Film, LineChart, Music } from "lucide-react";
import Link from "next/link";

/**
 * The central hub where users choose their journey into the PulseVest ecosystem.
 * It presents three clear paths: Creator, Investor, and Fan.
 */
export default function RoleSelectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center">
        <h1 className="font-satoshi text-4xl md:text-5xl font-extrabold mb-2 text-foreground">
          Join the Movement
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-12">
          Are you here to create, to invest, or to discover the future of
          African creativity?
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <RoleCard
          title="I am a Creator"
          description="Bring your vision to life and connect with backers who believe in your genius."
          icon={<Film className="w-12 h-12 text-primary" />}
          href="/auth/signup/creator"
        />
        <RoleCard
          title="I am an Investor"
          description="Discover and fund the next wave of African creative talent."
          icon={<LineChart className="w-12 h-12 text-secondary" />}
          href="/auth/signup/investor"
        />
        <RoleCard
          title="I am a Fan"
          description="Explore projects, review your favorites, and earn rewards directly from artists."
          icon={<Music className="w-12 h-12 text-green-500" />}
          href="/auth/signup/fan"
        />
      </div>
    </div>
  );
}

// A reusable component for the role selection cards to keep the code clean and consistent.
function RoleCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full text-center bg-card border-border hover:border-primary transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col justify-start p-8">
        <CardHeader className="items-center">
          {icon}
          <CardTitle className="mt-6">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
