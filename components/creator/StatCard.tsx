import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

// Define the properties the component will accept
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "default" | "primary";
}

/**
 * A reusable card component for displaying key statistics on the Creator Dashboard.
 * It's designed to be instantly scannable and visually impactful.
 */
export function StatCard({
  title,
  value,
  icon,
  variant = "default",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50",
        {
          "bg-primary text-primary-foreground": variant === "primary",
        }
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn("h-5 w-5", {
            "text-primary-foreground": variant === "primary",
            "text-secondary": variant === "default",
          })}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-satoshi text-4xl font-extrabold">{value}</div>
      </CardContent>
    </Card>
  );
}
