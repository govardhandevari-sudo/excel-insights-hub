import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon, subtitle, drilldownUrl }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (drilldownUrl) {
      navigate(drilldownUrl);
    }
  };

  return (
    <Card 
      className={cn(
        "shadow-card hover:shadow-card-hover transition-all duration-200",
        drilldownUrl && "cursor-pointer hover:scale-[1.02] hover:border-primary/50"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 min-w-0 flex-1">
            <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold font-heading text-foreground truncate">{value}</p>
            {change && (
              <p className={cn(
                "text-xs md:text-sm font-medium flex items-center gap-1 flex-wrap",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}>
                <span className="truncate">{change}</span>
                {subtitle && <span className="text-muted-foreground font-normal">• {subtitle}</span>}
              </p>
            )}
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 ml-2">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
        </div>
        {drilldownUrl && (
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-xs text-primary font-medium">Click to view details →</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
