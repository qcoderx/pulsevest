import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Film, LineChart, Music } from "lucide-react";
import Link from "next/link";

export default function RoleSelectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="font-satoshi text-4xl font-extrabold mb-2 text-center">
        Join the Movement
      </h1>
      <p className="text-muted text-lg mb-12 text-center">
        Are you here to create, invest, or discover?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <RoleCard
          role="creator"
          title="I am a Creator"
          description="Bring your vision to life and connect with backers who believe in you."
          icon={<Film className="w-12 h-12 text-primary" />}
          href="/creator/dashboard"
        />
        <RoleCard
          role="investor"
          title="I am an Investor"
          description="Discover and fund the next wave of African creative genius."
          icon={<LineChart className="w-12 h-12 text-secondary" />}
          href="/investor/dashboard"
        />
        {/* --- THE NEW FAN ROLE --- */}
        <RoleCard
          role="fan"
          title="I am a Fan"
          description="Explore projects, review your favorites, and earn rewards from artists."
          icon={<Music className="w-12 h-12 text-green-500" />}
          href="/fan/dashboard"
        />
      </div>
    </div>
  );
}

function RoleCard({
  role,
  title,
  description,
  icon,
  href,
}: {
  role: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="h-full text-center hover:border-primary transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col justify-between p-8">
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
