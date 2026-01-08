import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const branchData = [
  { sno: 1, state: "TS", branch: "Punjagutta", w52: 12.5, w51: 11.8, w50: 13.2, mtdPlan: 50.0, mtdAch: 42.5, achPct: 85.0, gap: -7.5, bdHead: "Nagesh", drilldownUrl: "/lab-rad?branch=punjagutta", date: new Date(2025, 11, 15) },
  { sno: 2, state: "TS", branch: "Kompally", w52: 9.8, w51: 8.5, w50: 10.2, mtdPlan: 40.0, mtdAch: 35.2, achPct: 88.0, gap: -4.8, bdHead: "Ganesh/Rakesh", drilldownUrl: "/lab-rad?branch=kompally", date: new Date(2025, 11, 14) },
  { sno: 3, state: "TS", branch: "KPHB", w52: 11.2, w51: 10.5, w50: 11.8, mtdPlan: 45.0, mtdAch: 38.5, achPct: 85.6, gap: -6.5, bdHead: "Prasanth", drilldownUrl: "/lab-rad?branch=kphb", date: new Date(2025, 11, 13) },
  { sno: 4, state: "TS", branch: "MBNR", w52: 5.4, w51: 4.8, w50: 5.2, mtdPlan: 22.0, mtdAch: 18.5, achPct: 84.1, gap: -3.5, bdHead: "Ramakrishna", drilldownUrl: "/lab-rad?branch=mbnr", date: new Date(2025, 11, 12) },
  { sno: 5, state: "TS", branch: "Nalgonda", w52: 4.2, w51: 3.9, w50: 4.5, mtdPlan: 18.0, mtdAch: 15.2, achPct: 84.4, gap: -2.8, bdHead: "Mallikarjun", drilldownUrl: "/lab-rad?branch=nalgonda", date: new Date(2025, 11, 11) },
  { sno: 6, state: "TS", branch: "Nizamabad", w52: 6.1, w51: 5.5, w50: 6.3, mtdPlan: 25.0, mtdAch: 21.8, achPct: 87.2, gap: -3.2, bdHead: "Uma", drilldownUrl: "/lab-rad?branch=nizamabad", date: new Date(2025, 11, 10) },
  { sno: 7, state: "TS", branch: "Medak", w52: 4.8, w51: 4.2, w50: 5.0, mtdPlan: 20.0, mtdAch: 16.5, achPct: 82.5, gap: -3.5, bdHead: "Srinivas E", drilldownUrl: "/lab-rad?branch=medak", date: new Date(2025, 11, 9) },
  { sno: 8, state: "TS", branch: "Sangareddy", w52: 5.2, w51: 4.8, w50: 5.5, mtdPlan: 22.0, mtdAch: 18.2, achPct: 82.7, gap: -3.8, bdHead: "Murali", drilldownUrl: "/lab-rad?branch=sangareddy", date: new Date(2025, 11, 8) },
  { sno: 9, state: "TS", branch: "Santhanu", w52: 3.8, w51: 3.5, w50: 4.0, mtdPlan: 16.0, mtdAch: 13.5, achPct: 84.4, gap: -2.5, bdHead: "Sujeeth", drilldownUrl: "/lab-rad?branch=santhanu", date: new Date(2025, 11, 7) },
  { sno: 10, state: "TS", branch: "Jagtial", w52: 4.5, w51: 4.0, w50: 4.8, mtdPlan: 18.0, mtdAch: 15.8, achPct: 87.8, gap: -2.2, bdHead: "Dr. Sujith", drilldownUrl: "/lab-rad?branch=jagtial", date: new Date(2025, 11, 6) },
  { sno: 11, state: "AP", branch: "Rajahmundry", w52: 7.2, w51: 6.5, w50: 7.5, mtdPlan: 30.0, mtdAch: 25.5, achPct: 85.0, gap: -4.5, bdHead: "Satish", drilldownUrl: "/lab-rad?branch=rajahmundry", date: new Date(2025, 11, 5) },
  { sno: 12, state: "KA", branch: "Bangalore", w52: 15.5, w51: 14.2, w50: 16.0, mtdPlan: 65.0, mtdAch: 55.8, achPct: 85.8, gap: -9.2, bdHead: "Dr. Sreenath", drilldownUrl: "/lab-rad?branch=bangalore", date: new Date(2025, 11, 4) },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { key: "state", label: "State", align: "center" },
  { key: "branch", label: "Branch", align: "left" },
  { key: "w52", label: "W52", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { key: "w51", label: "W51", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { key: "w50", label: "W50", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { key: "mtdPlan", label: "MTD Plan", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { key: "mtdAch", label: "MTD Ach.", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { 
    key: "achPct", 
    label: "Ach %", 
    align: "center", 
    render: (v) => (
      <Badge 
        variant="secondary" 
        className={v >= 85 ? "bg-success/10 text-success" : v >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}
      >
        {v.toFixed(1)}%
      </Badge>
    )
  },
  { 
    key: "gap", 
    label: "GAP", 
    align: "right", 
    render: (v) => (
      <span className={v >= 0 ? "text-success" : "text-destructive"}>
        {v >= 0 ? "+" : ""}₹{v.toFixed(1)}L
      </span>
    )
  },
  { key: "bdHead", label: "BD Head", align: "left" },
];

const DailyRevenue = () => {
  const [filters, setFilters] = useState({});
  
  const filteredData = useMemo(() => {
    return branchData.filter(item => {
      if (filters.state && filters.state !== "all" && item.state !== filters.state) return false;
      if (filters.branch && filters.branch !== "all" && item.branch.toLowerCase() !== filters.branch) return false;
      if (filters.dateFrom && item.date < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && item.date > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [filters]);

  const trendData = filteredData.map(b => ({
    name: b.branch.substring(0, 6),
    W50: b.w50,
    W51: b.w51,
    W52: b.w52,
  }));

  const totalMTD = filteredData.reduce((sum, b) => sum + b.mtdAch, 0);
  const totalPlan = filteredData.reduce((sum, b) => sum + b.mtdPlan, 0);
  const avgAch = totalPlan > 0 ? (totalMTD / totalPlan) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title="Daily Revenue Report"
          description="Branch-wise revenue performance across all states"
          icon={TrendingUp}
          badge="Daily Report"
        />

        <ReportFilters
          showState
          showBranch
          showDateRange
          filters={filters}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            title="Total MTD Achievement"
            value={`₹${totalMTD.toFixed(1)}L`}
            change={`${avgAch.toFixed(1)}% of target`}
            changeType="neutral"
            icon={TrendingUp}
          />
          <KPICard
            title="Total MTD Plan"
            value={`₹${totalPlan.toFixed(1)}L`}
            icon={Target}
          />
          <KPICard
            title="Best Performer"
            value="Kompally"
            change="88.0% achievement"
            changeType="positive"
            icon={ArrowUpRight}
            drilldownUrl="/lab-rad?branch=kompally"
          />
          <KPICard
            title="Needs Attention"
            value="Medak"
            change="82.5% achievement"
            changeType="negative"
            icon={ArrowDownRight}
            drilldownUrl="/lab-rad?branch=medak"
          />
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base md:text-lg">Weekly Trend by Branch (Stacked)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
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
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="W50" name="Week 50" fill="hsl(var(--chart-3))" stackId="a" />
                  <Bar dataKey="W51" name="Week 51" fill="hsl(var(--chart-2))" stackId="a" />
                  <Bar dataKey="W52" name="Week 52" fill="hsl(var(--chart-1))" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Branch-wise Revenue Summary"
          subtitle="All amounts in Lakhs (₹) - Click rows to drill down"
          columns={columns}
          data={filteredData}
          rowClickable
        />
      </div>
    </DashboardLayout>
  );
};

export default DailyRevenue;
