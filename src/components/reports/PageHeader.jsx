import { Badge } from "@/components/ui/badge";

export function PageHeader({ title, description, icon: Icon, badge }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex items-start gap-3 md:gap-4">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-heading text-foreground truncate">
            {title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      {badge && (
        <Badge variant="secondary" className="text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 self-start md:self-auto">
          {badge}
        </Badge>
      )}
    </div>
  );
}
