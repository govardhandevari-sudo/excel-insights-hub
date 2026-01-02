import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, TrendingUp, TrendingDown, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const salespersonData = [
  { sno: "", location: "KOMPALLY", isHeader: true },
  { sno: 1, name: "Ganesh", location: "Kompally", mtd: 4.82, projection: 5.5, growth: 12.5, nov: 4.28, novGrowth: 8.2, oct: 3.95, octGrowth: 5.5 },
  { sno: 2, name: "Rakesh", location: "Kompally", mtd: 3.42, projection: 4.0, growth: 15.2, nov: 2.97, novGrowth: 10.5, oct: 2.69, octGrowth: 7.2 },
  { sno: 3, name: "Devender", location: "Kompally", mtd: 2.85, projection: 3.3, growth: 8.5, nov: 2.63, novGrowth: 6.2, oct: 2.48, octGrowth: 4.5 },
  { sno: 4, name: "Goutham", location: "Kompally", mtd: 2.15, projection: 2.5, growth: 5.8, nov: 2.03, novGrowth: 4.2, oct: 1.95, octGrowth: 3.2 },
  { sno: "", location: "KPHB", isHeader: true },
  { sno: 5, name: "Prasanth", location: "KPHB", mtd: 3.95, projection: 4.5, growth: 8.0, nov: 3.66, novGrowth: 6.5, oct: 3.44, octGrowth: 5.0 },
  { sno: 6, name: "Madhav", location: "KPHB", mtd: 2.56, projection: 3.0, growth: 3.2, nov: 2.48, novGrowth: 2.8, oct: 2.41, octGrowth: 2.5 },
  { sno: 7, name: "Ramaswamy", location: "KPHB", mtd: 2.12, projection: 2.4, growth: 6.5, nov: 1.99, novGrowth: 5.2, oct: 1.89, octGrowth: 4.0 },
  { sno: 8, name: "Veeresh", location: "KPHB", mtd: 1.85, projection: 2.1, growth: 4.2, nov: 1.78, novGrowth: 3.5, oct: 1.72, octGrowth: 2.8 },
];

const chartData = salespersonData
  .filter(s => !s.isHeader && s.mtd)
  .sort((a, b) => (b.mtd || 0) - (a.mtd || 0))
  .slice(0, 8)
  .map(s => ({
    name: s.name,
    value: s.mtd,
    growth: s.growth,
  }));

const totalMTD = salespersonData.filter(s => !s.isHeader).reduce((sum, s) => sum + (s.mtd || 0), 0);
const avgGrowth = salespersonData.filter(s => !s.isHeader && s.growth).reduce((sum, s) => sum + (s.growth || 0), 0) / 
                  salespersonData.filter(s => !s.isHeader && s.growth).length;

const columns = [
  { key: "sno", label: "S.No", align: "center" as const },
  { 
    key: "name", 
    label: "Name", 
    align: "left" as const,
    render: (v: string, row: any) => row.isHeader ? <span className="font-bold text-primary">{row.location}</span> : v
  },
  { key: "location", label: "Location", align: "left" as const, render: (v: string, row: any) => row.isHeader ? "" : v },
  { key: "mtd", label: "Dec MTD (₹L)", align: "right" as const, render: (v: number) => v ? `₹${v.toFixed(2)}L` : "" },
  { key: "projection", label: "Projection", align: "right" as const, render: (v: number) => v ? `₹${v.toFixed(1)}L` : "" },
  { 
    key: "growth", 
    label: "Growth %", 
    align: "center" as const, 
    render: (v: number) => v ? (
      <Badge 
        variant="secondary" 
        className={v >= 10 ? "bg-success/10 text-success" : v >= 5 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}
      >
        +{v.toFixed(1)}%
      </Badge>
    ) : ""
  },
  { key: "nov", label: "Nov '25", align: "right" as const, render: (v: number) => v ? `₹${v.toFixed(2)}L` : "" },
  { key: "oct", label: "Oct '25", align: "right" as const, render: (v: number) => v ? `₹${v.toFixed(2)}L` : "" },
];

const Salesperson = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Salesperson Performance"
          description="Individual sales team member performance tracking"
          icon={UserCheck}
          badge="Daily"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Team Revenue"
            value={`₹${totalMTD.toFixed(1)}L`}
            change="+9.5% vs Nov"
            changeType="positive"
            icon={TrendingUp}
          />
          <KPICard
            title="Top Performer"
            value="Ganesh"
            change="₹4.82L MTD"
            changeType="positive"
            icon={UserCheck}
          />
          <KPICard
            title="Avg Growth Rate"
            value={`${avgGrowth.toFixed(1)}%`}
            change="Month over month"
            changeType="positive"
            icon={TrendingUp}
          />
          <KPICard
            title="Team Size"
            value="8"
            change="2 locations"
            changeType="neutral"
            icon={Target}
          />
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Salesperson MTD Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
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
                    formatter={(value: number, name: string, props: any) => [
                      `₹${value.toFixed(2)}L (${props.payload.growth > 0 ? '+' : ''}${props.payload.growth.toFixed(1)}% growth)`, 
                      'Revenue'
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.growth >= 10 ? "hsl(var(--success))" : entry.growth >= 5 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Detailed Salesperson Performance"
          subtitle="Month-to-date performance with growth comparison"
          columns={columns}
          data={salespersonData}
        />
      </div>
    </DashboardLayout>
  );
};

export default Salesperson;
