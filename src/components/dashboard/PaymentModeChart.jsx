import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

const data = [
  { name: "Credit", value: 35, color: "hsl(var(--chart-1))" },
  { name: "UPI/Cards", value: 45, color: "hsl(var(--chart-2))" },
  { name: "Cash", value: 20, color: "hsl(var(--chart-3))" },
];

export function PaymentModeChart() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/payment-mode');
  };

  return (
    <Card className="shadow-card cursor-pointer hover:shadow-card-hover transition-shadow" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base md:text-lg">Payment Mode Distribution</CardTitle>
          <span className="text-xs text-primary">View details →</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="h-[160px] w-[160px] md:h-[180px] md:w-[180px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 md:space-y-3 w-full md:w-auto">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between md:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs md:text-sm text-muted-foreground">{item.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">{item.value}%</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
