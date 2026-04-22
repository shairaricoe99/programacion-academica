import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  variant?: "default" | "primary" | "accent" | "warning";
}

const variantStyles = {
  default: "bg-card border border-border",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  warning: "bg-warning text-warning-foreground",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  accent: "bg-accent-foreground/20 text-accent-foreground",
  warning: "bg-warning-foreground/20 text-warning-foreground",
};

export default function StatCard({ label, value, icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-xl p-5 shadow-card transition-shadow hover:shadow-elevated ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wider ${variant === "default" ? "text-muted-foreground" : "opacity-80"}`}>
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold">{value}</p>
          {trend && (
            <p className={`mt-1 text-xs font-medium ${variant === "default" ? "text-success" : "opacity-80"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${iconStyles[variant]}`}>{icon}</div>
      </div>
    </div>
  );
}
