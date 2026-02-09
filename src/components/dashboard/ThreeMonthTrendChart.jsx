import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const data = [
  { month: "Oct W1", oct: 42, nov: 0, dec: 0 },
  { month: "Oct W2", oct: 48, nov: 0, dec: 0 },
  { month: "Oct W3", oct: 45, nov: 0, dec: 0 },
  { month: "Oct W4", oct: 52, nov: 0, dec: 0 },
  { month: "Nov W1", oct: 0, nov: 46, dec: 0 },
  { month: "Nov W2", oct: 0, nov: 55, dec: 0 },
  { month: "Nov W3", oct: 0, nov: 50, dec: 0 },
  { month: "Nov W4", oct: 0, nov: 58, dec: 0 },
  { month: "Dec W1", oct: 0, nov: 0, dec: 52 },
  { month: "Dec W2", oct: 0, nov: 0, dec: 61 },
  { month: "Dec W3", oct: 0, nov: 0, dec: 55 },
  { month: "Dec W4", oct: 0, nov: 0, dec: 58 },
];

// Simplified continuous trend data
const trendData = [
  { name: "Oct W1", revenue: 42, target: 48 },
  { name: "Oct W2", revenue: 48, target: 48 },
  { name: "Oct W3", revenue: 45, target: 48 },
  { name: "Oct W4", revenue: 52, target: 48 },
  { name: "Nov W1", revenue: 46, target: 50 },
  { name: "Nov W2", revenue: 55, target: 50 },
  { name: "Nov W3", revenue: 50, target: 50 },
  { name: "Nov W4", revenue: 58, target: 50 },
  { name: "Dec W1", revenue: 52, target: 52 },
  { name: "Dec W2", revenue: 61, target: 52 },
  { name: "Dec W3", revenue: 55, target: 52 },
  { name: "Dec W4", revenue: 58, target: 52 },
];

export function ThreeMonthTrendChart() {
  const navigate = useNavigate();

  return (
    <Card className="shadow-card cursor-pointer hover:shadow-card-hover transition-shadow" onClick={() => navigate('/revenue')}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base md:text-lg">Revenue Trend - 3 Months (Oct–Dec)</CardTitle>
          <span className="text-xs text-primary">View details →</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
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
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value) => [`₹${value}L`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="target" name="Target" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
