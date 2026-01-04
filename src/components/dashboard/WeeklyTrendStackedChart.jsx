import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const data = [
  { name: "Punjagutta", w50: 13.2, w51: 11.8, w52: 12.5 },
  { name: "Kompally", w50: 10.2, w51: 8.5, w52: 9.8 },
  { name: "KPHB", w50: 11.8, w51: 10.5, w52: 11.2 },
  { name: "MBNR", w50: 5.2, w51: 4.8, w52: 5.4 },
  { name: "Bangalore", w50: 16.0, w51: 14.2, w52: 15.5 },
  { name: "Rajahmundry", w50: 7.5, w51: 6.5, w52: 7.2 },
];

export function WeeklyTrendStackedChart() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/revenue');
  };

  return (
    <Card className="shadow-card cursor-pointer hover:shadow-card-hover transition-shadow" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base md:text-lg">Weekly Revenue Trend (Stacked)</CardTitle>
          <span className="text-xs text-primary">Click to drill down →</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="w50" name="Week 50" fill="hsl(var(--chart-3))" stackId="a" />
              <Bar dataKey="w51" name="Week 51" fill="hsl(var(--chart-2))" stackId="a" />
              <Bar dataKey="w52" name="Week 52" fill="hsl(var(--chart-1))" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
