import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, TrendingUp, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, Legend } from "recharts";

const salespersonData = [
  { sno: "", location: "KOMPALLY", isHeader: true },
  { sno: 1, name: "Ganesh", location: "Kompally", mtd: 4.82, projection: 5.5, growth: 12.5, nov: 4.28, oct: 3.95 },
  { sno: 2, name: "Rakesh", location: "Kompally", mtd: 3.42, projection: 4.0, growth: 15.2, nov: 2.97, oct: 2.69 },
  { sno: 3, name: "Devender", location: "Kompally", mtd: 2.85, projection: 3.3, growth: 8.5, nov: 2.63, oct: 2.48 },
  { sno: 4, name: "Goutham", location: "Kompally", mtd: 2.15, projection: 2.5, growth: 5.8, nov: 2.03, oct: 1.95 },
  { sno: "", location: "KPHB", isHeader: true },
  { sno: 5, name: "Prasanth", location: "KPHB", mtd: 3.95, projection: 4.5, growth: 8.0, nov: 3.66, oct: 3.44 },
  { sno: 6, name: "Madhav", location: "KPHB", mtd: 2.56, projection: 3.0, growth: 3.2, nov: 2.48, oct: 2.41 },
  { sno: 7, name: "Ramaswamy", location: "KPHB", mtd: 2.12, projection: 2.4, growth: 6.5, nov: 1.99, oct: 1.89 },
  { sno: 8, name: "Veeresh", location: "KPHB", mtd: 1.85, projection: 2.1, growth: 4.2, nov: 1.78, oct: 1.72 },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { 
    key: "name", 
    label: "Name", 
    align: "left",
    render: (v, row) => row.isHeader ? <span className="font-bold text-primary">{row.location}</span> : v
  },
  { key: "location", label: "Location", align: "left", render: (v, row) => row.isHeader ? "" : v },
  { key: "mtd", label: "Dec MTD (₹L)", align: "right", render: (v) => v ? `₹${v.toFixed(2)}L` : "" },
  { key: "projection", label: "Projection", align: "right", render: (v) => v ? `₹${v.toFixed(1)}L` : "" },
  { 
    key: "growth", 
    label: "Growth %", 
    align: "center", 
    render: (v) => v ? (
      <Badge 
        variant="secondary" 
        className={v >= 10 ? "bg-success/10 text-success" : v >= 5 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}
      >
        +{v.toFixed(1)}%
      </Badge>
    ) : ""
  },
  { key: "nov", label: "Nov '25", align: "right", render: (v) => v ? `₹${v.toFixed(2)}L` : "" },
  { key: "oct", label: "Oct '25", align: "right", render: (v) => v ? `₹${v.toFixed(2)}L` : "" },
];

const Salesperson = () => {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return salespersonData.filter(item => {
      if (filters.branch && filters.branch !== "all") {
        if (item.isHeader) {
          return item.location.toLowerCase() === filters.branch;
        }
        return item.location.toLowerCase() === filters.branch;
      }
      if (filters.salesperson && filters.salesperson !== "all" && !item.isHeader) {
        return item.name.toLowerCase() === filters.salesperson;
      }
      return true;
    });
  }, [filters]);

  const chartData = filteredData
    .filter(s => !s.isHeader && s.mtd)
    .sort((a, b) => (b.mtd || 0) - (a.mtd || 0))
    .slice(0, 8)
    .map(s => ({
      name: s.name,
      value: s.mtd,
      growth: s.growth,
    }));

  const trendData = filteredData
    .filter(s => !s.isHeader && s.mtd)
    .slice(0, 4)
    .map(s => ({
      name: s.name,
      Oct: s.oct,
      Nov: s.nov,
      Dec: s.mtd,
    }));

  const totalMTD = filteredData.filter(s => !s.isHeader).reduce((sum, s) => sum + (s.mtd || 0), 0);
  const growthData = filteredData.filter(s => !s.isHeader && s.growth);
  const avgGrowth = growthData.length > 0 ? growthData.reduce((sum, s) => sum + (s.growth || 0), 0) / growthData.length : 0;

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title="Salesperson Performance"
          description="Individual sales team member performance tracking"
          icon={UserCheck}
          badge="Daily"
        />

        <ReportFilters
          showBranch
          showSalesperson
          showDateRange
          filters={filters}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
            value={filteredData.filter(s => !s.isHeader).length.toString()}
            change="Active members"
            changeType="neutral"
            icon={Target}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Salesperson MTD Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
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
                      formatter={(value, name, props) => [
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

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Monthly Trend (Top 4)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOctSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNovSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDecSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
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
                      formatter={(value) => [`₹${value.toFixed(2)}L`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="Oct" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorOctSales)" />
                    <Area type="monotone" dataKey="Nov" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorNovSales)" />
                    <Area type="monotone" dataKey="Dec" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorDecSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title="Detailed Salesperson Performance"
          subtitle="Month-to-date performance with growth comparison"
          columns={columns}
          data={filteredData}
        />
      </div>
    </DashboardLayout>
  );
};

export default Salesperson;
