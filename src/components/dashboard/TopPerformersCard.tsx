import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const topPerformers = [
  { name: "Ganesh", location: "Kompally", revenue: "₹4.82L", growth: "+12%" },
  { name: "Prasanth", location: "KPHB", revenue: "₹3.95L", growth: "+8%" },
  { name: "Rakesh", location: "Kompally", revenue: "₹3.42L", growth: "+15%" },
  { name: "Satish", location: "Rajahmundry", revenue: "₹2.89L", growth: "+5%" },
  { name: "Madhav", location: "KPHB", revenue: "₹2.56L", growth: "+3%" },
];

export function TopPerformersCard() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg">Top Salespersons - MTD</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topPerformers.map((person, index) => (
          <div key={person.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-foreground">{person.name}</p>
                <p className="text-xs text-muted-foreground">{person.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{person.revenue}</p>
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
