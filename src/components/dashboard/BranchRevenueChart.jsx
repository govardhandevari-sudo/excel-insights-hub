import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const data = [
  { name: "Punjagutta", lab: 12.5, rad: 8.3, drilldownUrl: "/revenue?branch=punjagutta" },
  { name: "Kompally", lab: 9.8, rad: 6.2, drilldownUrl: "/revenue?branch=kompally" },
  { name: "KPHB", lab: 11.2, rad: 7.5, drilldownUrl: "/revenue?branch=kphb" },
  { name: "MBNR", lab: 5.4, rad: 3.1, drilldownUrl: "/revenue?branch=mbnr" },
  { name: "Nalgonda", lab: 4.2, rad: 2.8, drilldownUrl: "/revenue?branch=nalgonda" },
  { name: "Nizamabad", lab: 6.1, rad: 4.5, drilldownUrl: "/revenue?branch=nizamabad" },
];

export function BranchRevenueChart() {
  const navigate = useNavigate();

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const payload = data.activePayload[0].payload;
      if (payload.drilldownUrl) {
        navigate(payload.drilldownUrl);
      }
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-base md:text-lg">Branch-wise Revenue (Lakhs)</CardTitle>
        <p className="text-xs text-muted-foreground">Click on bars to drill down</p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="lab" name="Lab" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="rad" name="Radiology" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
