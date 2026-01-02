import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const branchData = [
  { sno: 1, branch: "Punjagutta", labAvg: 1850, radAvg: 3200, totalAvg: 2475, nov: 2350, oct: 2280, bdHead: "Nagesh" },
  { sno: 2, branch: "Kompally", labAvg: 1650, radAvg: 2950, totalAvg: 2250, nov: 2180, oct: 2100, bdHead: "Ganesh/Rakesh" },
  { sno: 3, branch: "KPHB", labAvg: 1780, radAvg: 3100, totalAvg: 2380, nov: 2290, oct: 2200, bdHead: "Prasanth" },
  { sno: 4, branch: "MBNR", labAvg: 1450, radAvg: 2650, totalAvg: 1980, nov: 1890, oct: 1820, bdHead: "Ramakrishna" },
  { sno: 5, branch: "Sangareddy", labAvg: 1380, radAvg: 2480, totalAvg: 1850, nov: 1780, oct: 1720, bdHead: "Murali" },
  { sno: 6, branch: "Nalgonda", labAvg: 1320, radAvg: 2350, totalAvg: 1750, nov: 1680, oct: 1620, bdHead: "Mallikarjun" },
  { sno: 7, branch: "Nizamabad", labAvg: 1420, radAvg: 2580, totalAvg: 1920, nov: 1850, oct: 1780, bdHead: "Uma" },
  { sno: 8, branch: "Medak", labAvg: 1280, radAvg: 2280, totalAvg: 1680, nov: 1620, oct: 1560, bdHead: "Srinivas E" },
  { sno: 9, branch: "Santhanu", labAvg: 1250, radAvg: 2180, totalAvg: 1620, nov: 1560, oct: 1500, bdHead: "Sujeeth" },
  { sno: 10, branch: "Jagtial", labAvg: 1350, radAvg: 2420, totalAvg: 1800, nov: 1730, oct: 1670, bdHead: "Dr. Sujith" },
  { sno: 11, branch: "Rajahmundry", labAvg: 1580, radAvg: 2850, totalAvg: 2150, nov: 2080, oct: 2000, bdHead: "Satish" },
  { sno: 12, branch: "Bangalore", labAvg: 2100, radAvg: 3500, totalAvg: 2750, nov: 2650, oct: 2550, bdHead: "Dr. Sreenath" },
];

const chartData = branchData.map(b => ({
  name: b.branch.substring(0, 8),
  value: b.totalAvg,
}));

const avgOverall = branchData.reduce((sum, b) => sum + b.totalAvg, 0) / branchData.length;
const highestBranch = branchData.reduce((max, b) => b.totalAvg > max.totalAvg ? b : max, branchData[0]);
const lowestBranch = branchData.reduce((min, b) => b.totalAvg < min.totalAvg ? b : min, branchData[0]);

const columns = [
  { key: "sno", label: "S.No", align: "center" as const },
  { key: "branch", label: "Branch", align: "left" as const },
  { key: "labAvg", label: "Lab Avg (₹)", align: "right" as const, render: (v: number) => `₹${v.toLocaleString()}` },
  { key: "radAvg", label: "Rad Avg (₹)", align: "right" as const, render: (v: number) => `₹${v.toLocaleString()}` },
  { 
    key: "totalAvg", 
    label: "Total Avg (₹)", 
    align: "right" as const, 
    render: (v: number, row: any) => (
      <span className={v >= avgOverall ? "text-success font-semibold" : "text-foreground"}>
        ₹{v.toLocaleString()}
      </span>
    )
  },
  { key: "nov", label: "Nov '25", align: "right" as const, render: (v: number) => `₹${v.toLocaleString()}` },
  { key: "oct", label: "Oct '25", align: "right" as const, render: (v: number) => `₹${v.toLocaleString()}` },
  { key: "bdHead", label: "BD Head", align: "left" as const },
];

const AvgRealisation = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Avg Realisation Per Patient"
          description="Average revenue generated per patient across branches"
          icon={Users}
          badge="Weekly"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Overall Average"
            value={`₹${Math.round(avgOverall).toLocaleString()}`}
            change="+8.3% vs Nov"
            changeType="positive"
            icon={Users}
          />
          <KPICard
            title="Highest Avg"
            value={highestBranch.branch}
            change={`₹${highestBranch.totalAvg.toLocaleString()} per patient`}
            changeType="positive"
            icon={TrendingUp}
          />
          <KPICard
            title="Lowest Avg"
            value={lowestBranch.branch}
            change={`₹${lowestBranch.totalAvg.toLocaleString()} per patient`}
            changeType="negative"
            icon={TrendingDown}
          />
          <KPICard
            title="Target Avg"
            value="₹2,500"
            change={`${(((avgOverall - 2500) / 2500) * 100).toFixed(1)}% gap`}
            changeType="neutral"
            icon={Target}
          />
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Average Per Patient by Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v/1000).toFixed(1)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Avg per patient']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.value >= avgOverall ? "hsl(var(--success))" : "hsl(var(--chart-1))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Branch-wise Average Realisation"
          subtitle="Monthly comparison - Green indicates above average"
          columns={columns}
          data={branchData}
        />
      </div>
    </DashboardLayout>
  );
};

export default AvgRealisation;
