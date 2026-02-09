import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const branchData = [
  { sno: 1, branch: "Punjagutta", labAvg: 1850, radAvg: 3200, totalAvg: 2475, nov: 2350, oct: 2280, mriAvg: 4500, ctAvg: 3200, usgAvg: 2800, xrayAvg: 1500, labAvg2: 1850, bdHead: "Nagesh" },
  { sno: 2, branch: "Kompally", labAvg: 1650, radAvg: 2950, totalAvg: 2250, nov: 2180, oct: 2100, mriAvg: 4200, ctAvg: 3000, usgAvg: 2600, xrayAvg: 1400, labAvg2: 1650, bdHead: "Ganesh/Rakesh" },
  { sno: 3, branch: "KPHB", labAvg: 1780, radAvg: 3100, totalAvg: 2380, nov: 2290, oct: 2200, mriAvg: 4350, ctAvg: 3100, usgAvg: 2700, xrayAvg: 1450, labAvg2: 1780, bdHead: "Prasanth" },
  { sno: 4, branch: "MBNR", labAvg: 1450, radAvg: 2650, totalAvg: 1980, nov: 1890, oct: 1820, mriAvg: 3800, ctAvg: 2600, usgAvg: 2300, xrayAvg: 1200, labAvg2: 1450, bdHead: "Ramakrishna" },
  { sno: 5, branch: "Sangareddy", labAvg: 1380, radAvg: 2480, totalAvg: 1850, nov: 1780, oct: 1720, mriAvg: 3600, ctAvg: 2500, usgAvg: 2200, xrayAvg: 1150, labAvg2: 1380, bdHead: "Murali" },
  { sno: 6, branch: "Nalgonda", labAvg: 1320, radAvg: 2350, totalAvg: 1750, nov: 1680, oct: 1620, mriAvg: 3400, ctAvg: 2400, usgAvg: 2100, xrayAvg: 1100, labAvg2: 1320, bdHead: "Mallikarjun" },
  { sno: 7, branch: "Nizamabad", labAvg: 1420, radAvg: 2580, totalAvg: 1920, nov: 1850, oct: 1780, mriAvg: 3700, ctAvg: 2550, usgAvg: 2250, xrayAvg: 1180, labAvg2: 1420, bdHead: "Uma" },
  { sno: 8, branch: "Rajahmundry", labAvg: 1580, radAvg: 2850, totalAvg: 2150, nov: 2080, oct: 2000, mriAvg: 4000, ctAvg: 2800, usgAvg: 2500, xrayAvg: 1350, labAvg2: 1580, bdHead: "Satish" },
  { sno: 9, branch: "Bangalore", labAvg: 2100, radAvg: 3500, totalAvg: 2750, nov: 2650, oct: 2550, mriAvg: 5000, ctAvg: 3500, usgAvg: 3000, xrayAvg: 1800, labAvg2: 2100, bdHead: "Dr. Sreenath" },
];

const AvgRealisation = () => {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return branchData.filter(item => {
      if (filters.branch && filters.branch !== "all" && item.branch.toLowerCase() !== filters.branch) return false;
      return true;
    });
  }, [filters]);

  const avgOverall = filteredData.reduce((sum, b) => sum + b.totalAvg, 0) / filteredData.length;
  const highestBranch = filteredData.reduce((max, b) => b.totalAvg > max.totalAvg ? b : max, filteredData[0]);
  const lowestBranch = filteredData.reduce((min, b) => b.totalAvg < min.totalAvg ? b : min, filteredData[0]);

  // Dept/Modality breakdown (aggregated avg)
  const modalityAvgData = [
    { name: "MRI", value: Math.round(filteredData.reduce((s, b) => s + b.mriAvg, 0) / filteredData.length) },
    { name: "CT", value: Math.round(filteredData.reduce((s, b) => s + b.ctAvg, 0) / filteredData.length) },
    { name: "USG", value: Math.round(filteredData.reduce((s, b) => s + b.usgAvg, 0) / filteredData.length) },
    { name: "X-Ray", value: Math.round(filteredData.reduce((s, b) => s + b.xrayAvg, 0) / filteredData.length) },
    { name: "Lab", value: Math.round(filteredData.reduce((s, b) => s + b.labAvg2, 0) / filteredData.length) },
  ];

  // 3-month trend
  const trendData = filteredData.map(b => ({ name: b.branch.substring(0, 6), Oct: b.oct, Nov: b.nov, Dec: b.totalAvg }));

  // Branch-wise stacked
  const chartData = filteredData.map(b => ({ name: b.branch.substring(0, 6), Lab: b.labAvg, Radiology: b.radAvg }));

  const columns = [
    { key: "sno", label: "S.No", align: "center" },
    { key: "branch", label: "Branch", align: "left" },
    { key: "labAvg", label: "Lab Avg (₹)", align: "right", render: (v) => `₹${v.toLocaleString()}` },
    { key: "radAvg", label: "Rad Avg (₹)", align: "right", render: (v) => `₹${v.toLocaleString()}` },
    { key: "totalAvg", label: "Total Avg (₹)", align: "right", render: (v) => <span className={v >= avgOverall ? "text-success font-semibold" : "text-foreground"}>₹{v.toLocaleString()}</span> },
    { key: "nov", label: "Nov '25", align: "right", render: (v) => `₹${v.toLocaleString()}` },
    { key: "oct", label: "Oct '25", align: "right", render: (v) => `₹${v.toLocaleString()}` },
    { key: "bdHead", label: "BD Head", align: "left" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader title="Avg Realisation Per Patient" description="Dept, Modality & Branch-wise average per patient (3-Month Trend)" icon={Users} badge="3-Month View" />

        <ReportFilters showBranch showDateRange filters={filters} onFilterChange={setFilters} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard title="Overall Average" value={`₹${Math.round(avgOverall).toLocaleString()}`} change="+8.3% vs Nov" changeType="positive" icon={Users} />
          <KPICard title="Highest Avg" value={highestBranch?.branch || "N/A"} change={`₹${highestBranch?.totalAvg?.toLocaleString()} per patient`} changeType="positive" icon={TrendingUp} />
          <KPICard title="Lowest Avg" value={lowestBranch?.branch || "N/A"} change={`₹${lowestBranch?.totalAvg?.toLocaleString()} per patient`} changeType="negative" icon={TrendingDown} />
          <KPICard title="Target Avg" value="₹2,500" change={`${(((avgOverall - 2500) / 2500) * 100).toFixed(1)}% gap`} changeType="neutral" icon={Target} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Modality-wise Avg/Patient */}
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Avg per Patient by Modality</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modalityAvgData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(1)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toLocaleString()}`, 'Avg/Patient']} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lab vs Rad Avg Stacked */}
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Lab vs Radiology Avg by Branch</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} angle={-45} textAnchor="end" />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(1)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Lab" fill="hsl(var(--chart-1))" stackId="a" />
                    <Bar dataKey="Radiology" fill="hsl(var(--chart-2))" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3-Month Trend */}
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">3-Month Trend by Branch</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorOctAR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorNovAR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorDecAR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} angle={-45} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(1)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="Oct" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorOctAR)" />
                  <Area type="monotone" dataKey="Nov" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorNovAR)" />
                  <Area type="monotone" dataKey="Dec" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorDecAR)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Branch-wise Average Realisation"
          subtitle="Green indicates above average - Click rows to drill down"
          columns={columns}
          data={filteredData}
          rowClickable
          exportFilename="avg-realisation-report"
        />
      </div>
    </DashboardLayout>
  );
};

export default AvgRealisation;
