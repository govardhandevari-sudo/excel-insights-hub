import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const data = [
  { month: "Jul", lab: 180, rad: 220 },
  { month: "Aug", lab: 195, rad: 235 },
  { month: "Sep", lab: 188, rad: 245 },
  { month: "Oct", lab: 210, rad: 260 },
  { month: "Nov", lab: 225, rad: 275 },
  { month: "Dec", lab: 240, rad: 295 },
];

export function MonthlyTrendAreaChart() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/lab-rad');
  };

  return (
    <Card className="shadow-card cursor-pointer hover:shadow-card-hover transition-shadow" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base md:text-lg">Lab vs Radiology - 6 Month Trend</CardTitle>
          <span className="text-xs text-primary">View details →</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLab" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v}L`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
                formatter={(value) => [`₹${value}L`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area 
                type="monotone" 
                dataKey="lab" 
                name="Lab"
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLab)"
              />
              <Area 
                type="monotone" 
                dataKey="rad" 
                name="Radiology"
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
