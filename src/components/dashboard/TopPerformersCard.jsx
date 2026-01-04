import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const topPerformers = [
  { name: "Ganesh", location: "Kompally", revenue: "₹4.82L", growth: "+12%", id: "ganesh" },
  { name: "Prasanth", location: "KPHB", revenue: "₹3.95L", growth: "+8%", id: "prasanth" },
  { name: "Rakesh", location: "Kompally", revenue: "₹3.42L", growth: "+15%", id: "rakesh" },
  { name: "Satish", location: "Rajahmundry", revenue: "₹2.89L", growth: "+5%", id: "satish" },
  { name: "Madhav", location: "KPHB", revenue: "₹2.56L", growth: "+3%", id: "madhav" },
];

export function TopPerformersCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/salesperson');
  };

  return (
    <Card className="shadow-card cursor-pointer hover:shadow-card-hover transition-shadow" onClick={handleClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base md:text-lg">Top Salespersons - MTD</CardTitle>
          <span className="text-xs text-primary">View all →</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {topPerformers.map((person, index) => (
          <div key={person.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs md:text-sm">
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{person.name}</p>
                <p className="text-xs text-muted-foreground truncate">{person.location}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-foreground text-sm">{person.revenue}</p>
              <Badge variant="secondary" className="text-xs bg-success/10 text-success hover:bg-success/10">
                {person.growth}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
