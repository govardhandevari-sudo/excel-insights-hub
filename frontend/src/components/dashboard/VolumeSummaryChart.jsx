import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

const data = [
  { name: "Radiology", value: 9370, color: "hsl(var(--chart-1))" },
  { name: "Lab", value: 13500, color: "hsl(var(--chart-4))" },
  { name: "Cardiology", value: 2997, color: "hsl(var(--chart-2))" },
  { name: "Others", value: 1580, color: "hsl(var(--chart-3))" },
];

export function VolumeSummaryChart() {
  const navigate = useNavigate();

  return (
    <Card className="shadow-card cursor-pointer hover:shadow-card-hover transition-shadow" onClick={() => navigate('/dept-volume')}>
      <CardHeader className="pb-1 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-sm md:text-base">Volume Summary</CardTitle>
          <span className="text-xs text-primary">→</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value) => [value.toLocaleString(), '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
