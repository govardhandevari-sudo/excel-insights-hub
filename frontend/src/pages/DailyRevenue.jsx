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

// Updated data structure based on Excel Sheet 1 format
const branchData = [
  // Telangana branches
  { sno: 1, state: "TS", branch: "PUNJAGUTTA", d28: 2.5, d29: 3.2, d30: 2.8, d31: 3.5, w52: 12.5, w51: 11.8, w50: 13.2, w49: 12.0, mtdPlan: 50.0, mtdAch: 42.5, achPct: 85.0, perDayPlan: 1.61, decTarget: 50.0, mtdProjection: 48.5, gap: -7.5, nov: 45.2, oct: 43.8, bdHead: "NAGESH", isHeader: false, date: new Date(2025, 11, 31) },
  { sno: 2, state: "TS", branch: "KOMPALLY", d28: 1.8, d29: 2.5, d30: 2.2, d31: 2.8, w52: 9.8, w51: 8.5, w50: 10.2, w49: 9.0, mtdPlan: 40.0, mtdAch: 35.2, achPct: 88.0, perDayPlan: 1.29, decTarget: 40.0, mtdProjection: 38.5, gap: -4.8, nov: 36.5, oct: 34.2, bdHead: "GANESH/RAKESH", isHeader: false, date: new Date(2025, 11, 31) },
  { sno: 3, state: "TS", branch: "KPHB", d28: 2.2, d29: 2.8, d30: 2.5, d31: 3.0, w52: 11.2, w51: 10.5, w50: 11.8, w49: 10.8, mtdPlan: 45.0, mtdAch: 38.5, achPct: 85.6, perDayPlan: 1.45, decTarget: 45.0, mtdProjection: 42.0, gap: -6.5, nov: 40.2, oct: 38.5, bdHead: "PRASANTH&RAMASWAMY", isHeader: false, date: new Date(2025, 11, 31) },
  // NEW ACQUISITIONS header
  { sno: "", state: "", branch: "NEW ACQUISITIONS", isHeader: true },
  { sno: 4, state: "TS", branch: "MBNR", d28: 1.0, d29: 1.2, d30: 1.1, d31: 1.4, w52: 5.4, w51: 4.8, w50: 5.2, w49: 4.5, mtdPlan: 22.0, mtdAch: 18.5, achPct: 84.1, perDayPlan: 0.71, decTarget: 22.0, mtdProjection: 20.0, gap: -3.5, nov: 19.2, oct: 17.8, bdHead: "RAMAKRISHNA", isHeader: false, date: new Date(2025, 11, 31) },
  { sno: 5, state: "TS", branch: "NALGONDA", d28: 0.8, d29: 1.0, d30: 0.9, d31: 1.1, w52: 4.2, w51: 3.9, w50: 4.5, w49: 4.0, mtdPlan: 18.0, mtdAch: 15.2, achPct: 84.4, perDayPlan: 0.58, decTarget: 18.0, mtdProjection: 16.5, gap: -2.8, nov: 15.8, oct: 14.5, bdHead: "MALLIKARJUN", isHeader: false, date: new Date(2025, 11, 31) },
  { sno: 6, state: "TS", branch: "NIZAMABAD", d28: 1.2, d29: 1.5, d30: 1.3, d31: 1.6, w52: 6.1, w51: 5.5, w50: 6.3, w49: 5.8, mtdPlan: 25.0, mtdAch: 21.8, achPct: 87.2, perDayPlan: 0.81, decTarget: 25.0, mtdProjection: 23.5, gap: -3.2, nov: 22.5, oct: 21.0, bdHead: "UMA", isHeader: false, date: new Date(2025, 11, 31) },
  { sno: 7, state: "TS", branch: "MEDAK", d28: 0.9, d29: 1.1, d30: 1.0, d31: 1.2, w52: 4.8, w51: 4.2, w50: 5.0, w49: 4.5, mtdPlan: 20.0, mtdAch: 16.5, achPct: 82.5, perDayPlan: 0.65, decTarget: 20.0, mtdProjection: 18.0, gap: -3.5, nov: 17.2, oct: 16.0, bdHead: "SRINIVAS E", isHeader: false, date: new Date(2025, 11, 31) },
  { sno: 8, state: "TS", branch: "SANGAREDDY", d28: 1.0, d29: 1.2, d30: 1.1, d31: 1.3, w52: 5.2, w51: 4.8, w50: 5.5, w49: 5.0, mtdPlan: 22.0, mtdAch: 18.2, achPct: 82.7, perDayPlan: 0.71, decTarget: 22.0, mtdProjection: 19.8, gap: -3.8, nov: 18.8, oct: 17.5, bdHead: "MURALI", isHeader: false, date: new Date(2025, 11, 31) },
  { sno: 9, state: "TS", branch: "SANTHANU", d28: 0.7, d29: 0.9, d30: 0.8, d31: 1.0, w52: 3.8, w51: 3.5, w50: 4.0, w49: 3.6, mtdPlan: 16.0, mtdAch: 13.5, achPct: 84.4, perDayPlan: 0.52, decTarget: 16.0, mtdProjection: 14.5, gap: -2.5, nov: 14.0, oct: 13.2, bdHead: "SUJEETH", isHeader: false, date: new Date(2025, 11, 31) },
  { sno: 10, state: "TS", branch: "JAGTIAL", d28: 0.9, d29: 1.0, d30: 1.0, d31: 1.2, w52: 4.5, w51: 4.0, w50: 4.8, w49: 4.2, mtdPlan: 18.0, mtdAch: 15.8, achPct: 87.8, perDayPlan: 0.58, decTarget: 18.0, mtdProjection: 17.0, gap: -2.2, nov: 16.2, oct: 15.0, bdHead: "Dr. SUJITH", isHeader: false, date: new Date(2025, 11, 31) },
  // Total Telangana header
  { sno: "", state: "", branch: "TOTAL TELANGANA", isHeader: true, isTotalRow: true },
  // Andhra Pradesh
  { sno: "", state: "", branch: "ANDHRA PRADESH", isHeader: true },
  { sno: 11, state: "AP", branch: "RAJAHMUNDRY", d28: 1.4, d29: 1.8, d30: 1.6, d31: 2.0, w52: 7.2, w51: 6.5, w50: 7.5, w49: 6.8, mtdPlan: 30.0, mtdAch: 25.5, achPct: 85.0, perDayPlan: 0.97, decTarget: 30.0, mtdProjection: 27.8, gap: -4.5, nov: 26.5, oct: 24.8, bdHead: "SATISH", isHeader: false, date: new Date(2025, 11, 31) },
  // Karnataka
  { sno: "", state: "", branch: "KARNATAKA", isHeader: true },
  { sno: 12, state: "KA", branch: "BANGALORE", d28: 3.0, d29: 3.8, d30: 3.5, d31: 4.2, w52: 15.5, w51: 14.2, w50: 16.0, w49: 14.8, mtdPlan: 65.0, mtdAch: 55.8, achPct: 85.8, perDayPlan: 2.10, decTarget: 65.0, mtdProjection: 60.5, gap: -9.2, nov: 58.2, oct: 55.0, bdHead: "DR.SREENATH", isHeader: false, date: new Date(2025, 11, 31) },
];

// Full columns with all data - table will be horizontally scrollable
const columns = [
  { key: "sno", label: "S.No", align: "center", render: (v, row) => row.isHeader ? "" : v },
  { key: "state", label: "State", align: "center", render: (v, row) => row.isHeader ? "" : v },
  { 
    key: "branch", 
    label: "Branch", 
    align: "left",
    render: (v, row) => row.isHeader ? (
      <span className={`font-bold whitespace-nowrap ${row.isTotalRow ? "text-primary" : "text-muted-foreground"}`}>{v}</span>
    ) : <span className="whitespace-nowrap">{v}</span>
  },
  { key: "d28", label: "28-Dec", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(2) : "-") },
  { key: "d29", label: "29-Dec", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(2) : "-") },
  { key: "d30", label: "30-Dec", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(2) : "-") },
  { key: "d31", label: "31-Dec", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(2) : "-") },
  { key: "w52", label: "W52", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(2) : "-") },
  { key: "w51", label: "W51", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(2) : "-") },
  { key: "w50", label: "W50", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(2) : "-") },
  { key: "w49", label: "W49", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(2) : "-") },
  { key: "mtdPlan", label: "MTD Plan", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? `₹${v.toFixed(1)}L` : "-") },
  { key: "mtdAch", label: "MTD Ach", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? `₹${v.toFixed(1)}L` : "-") },
  { 
    key: "achPct", 
    label: "Ach%", 
    align: "center", 
    render: (v, row) => row.isHeader ? "-" : (v ? (
      <Badge 
        variant="secondary" 
        className={v >= 85 ? "bg-success/10 text-success" : v >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}
      >
        {v.toFixed(1)}%
      </Badge>
    ) : "-")
  },
  { key: "perDayPlan", label: "Per Day Plan", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(2) : "-") },
  { key: "decTarget", label: "Dec Target", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? `₹${v.toFixed(1)}L` : "-") },
  { key: "mtdProjection", label: "MTD Proj", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? `₹${v.toFixed(1)}L` : "-") },
  { 
    key: "gap", 
    label: "GAP", 
    align: "right", 
    render: (v, row) => row.isHeader ? "-" : (v !== undefined ? (
      <span className={v >= 0 ? "text-success" : "text-destructive"}>
        {v >= 0 ? "+" : ""}{v.toFixed(1)}L
      </span>
    ) : "-")
  },
  { key: "nov", label: "Nov", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(1) : "-") },
  { key: "oct", label: "Oct", align: "right", render: (v, row) => row.isHeader ? "-" : (v ? v.toFixed(1) : "-") },
  { key: "bdHead", label: "BD Head", align: "left", render: (v, row) => row.isHeader ? "" : <span className="whitespace-nowrap">{v}</span> },
];

const DailyRevenue = () => {
  const [filters, setFilters] = useState({});
  
  const filteredData = useMemo(() => {
    return branchData.filter(item => {
      if (item.isHeader) return true; // Always show headers
      if (filters.state && filters.state !== "all" && item.state !== filters.state) return false;
      if (filters.branch && filters.branch !== "all" && item.branch.toLowerCase() !== filters.branch) return false;
      if (filters.dateFrom && item.date < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && item.date > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [filters]);

  const actualData = filteredData.filter(b => !b.isHeader);
  
  const trendData = actualData.map(b => ({
    name: b.branch.substring(0, 6),
    W49: b.w49 || 0,
    W50: b.w50 || 0,
    W51: b.w51 || 0,
    W52: b.w52 || 0,
  }));

  const totalMTD = actualData.reduce((sum, b) => sum + (b.mtdAch || 0), 0);
  const totalPlan = actualData.reduce((sum, b) => sum + (b.mtdPlan || 0), 0);
  const avgAch = totalPlan > 0 ? (totalMTD / totalPlan) * 100 : 0;
  
  // Find best and worst performers
  const bestPerformer = actualData.reduce((best, b) => (!best || (b.achPct || 0) > (best.achPct || 0)) ? b : best, null);
  const worstPerformer = actualData.reduce((worst, b) => (!worst || (b.achPct || 0) < (worst.achPct || 0)) ? b : worst, null);

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title="Daily Revenue Report"
          description="Branch-wise revenue performance across all states (All Nums in Lakhs with 2 decimals)"
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
            value={bestPerformer?.branch || "N/A"}
            change={`${bestPerformer?.achPct?.toFixed(1) || 0}% achievement`}
            changeType="positive"
            icon={ArrowUpRight}
            drilldownUrl={`/lab-rad?branch=${bestPerformer?.branch?.toLowerCase()}`}
          />
          <KPICard
            title="Needs Attention"
            value={worstPerformer?.branch || "N/A"}
            change={`${worstPerformer?.achPct?.toFixed(1) || 0}% achievement`}
            changeType="negative"
            icon={ArrowDownRight}
            drilldownUrl={`/lab-rad?branch=${worstPerformer?.branch?.toLowerCase()}`}
          />
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base md:text-lg">Weekly Trend by Branch (W49-W52)</CardTitle>
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
                  <Bar dataKey="W49" name="Week 49" fill="hsl(var(--chart-4))" stackId="a" />
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
          exportFilename="daily-revenue-report"
        />
      </div>
    </DashboardLayout>
  );
};

export default DailyRevenue;
