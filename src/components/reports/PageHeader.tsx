import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export function PageHeader({ title, description, icon: Icon, badge }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      {badge && (
        <Badge variant="secondary" className="text-sm px-4 py-2">
          {badge}
        </Badge>
      )}
    </div>
  );
}
