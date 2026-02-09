import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExcelDownloadButton } from "@/components/reports/ExcelDownloadButton";
import { GitBranch, TrendingUp, Users, UserMinus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";

const branchData = [
  { branch: "Punjagutta", refOct: 68.2, refNov: 70.5, refDec: 72.5, nonRefOct: 28.8, nonRefNov: 30.2, nonRefDec: 31.6, total: 104.1 },
  { branch: "Kompally", refOct: 62.5, refNov: 65.8, refDec: 68.6, nonRefOct: 35.0, nonRefNov: 37.2, nonRefDec: 38.5, total: 107.1 },
  { branch: "KPHB", refOct: 55.2, refNov: 58.0, refDec: 60.5, nonRefOct: 26.5, nonRefNov: 28.0, nonRefDec: 29.8, total: 90.3 },
  { branch: "MBNR", refOct: 20.5, refNov: 22.0, refDec: 23.2, nonRefOct: 11.0, nonRefNov: 12.0, nonRefDec: 12.5, total: 35.7 },
  { branch: "Sangareddy", refOct: 16.5, refNov: 17.8, refDec: 19.0, nonRefOct: 9.0, nonRefNov: 9.5, nonRefDec: 10.2, total: 29.2 },
  { branch: "Nalgonda", refOct: 12.0, refNov: 13.0, refDec: 13.9, nonRefOct: 6.5, nonRefNov: 7.0, nonRefDec: 7.4, total: 21.3 },
  { branch: "Nizamabad", refOct: 18.5, refNov: 20.0, refDec: 21.2, nonRefOct: 9.2, nonRefNov: 9.8, nonRefDec: 10.4, total: 31.6 },
  { branch: "Medak", refOct: 11.0, refNov: 12.0, refDec: 13.0, nonRefOct: 6.0, nonRefNov: 6.5, nonRefDec: 7.0, total: 20.0 },
  { branch: "Rajahmundry", refOct: 23.0, refNov: 25.0, refDec: 26.8, nonRefOct: 11.5, nonRefNov: 12.5, nonRefDec: 13.2, total: 40.0 },
  { branch: "Bangalore", refOct: 62.0, refNov: 65.5, refDec: 68.4, nonRefOct: 33.0, nonRefNov: 35.0, nonRefDec: 36.8, total: 105.2 },
];

const RefNonRef = () => {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return branchData.filter(item => {
      if (filters.branch && filters.branch !== "all" && item.branch.toLowerCase() !== filters.branch) return false;
      return true;
    });
  }, [filters]);

  const totalRefDec = filteredData.reduce((sum, b) => sum + b.refDec, 0);
  const totalNonRefDec = filteredData.reduce((sum, b) => sum + b.nonRefDec, 0);
  const totalRefNov = filteredData.reduce((sum, b) => sum + b.refNov, 0);
  const totalNonRefNov = filteredData.reduce((sum, b) => sum + b.nonRefNov, 0);
  const totalRefOct = filteredData.reduce((sum, b) => sum + b.refOct, 0);
  const totalNonRefOct = filteredData.reduce((sum, b) => sum + b.nonRefOct, 0);
  const grandTotal = totalRefDec + totalNonRefDec;

  const pieData = [
    { name: "Referral", value: totalRefDec, color: "hsl(var(--success))" },
    { name: "Non-Referral", value: totalNonRefDec, color: "hsl(var(--chart-2))" },
  ];

  const trendData = [
    { month: "Oct", Referral: totalRefOct, NonReferral: totalNonRefOct },
    { month: "Nov", Referral: totalRefNov, NonReferral: totalNonRefNov },
    { month: "Dec", Referral: totalRefDec, NonReferral: totalNonRefDec },
  ];

  const branchChartData = filteredData.map(b => ({
    name: b.branch.substring(0, 8),
    Referral: b.refDec,
    NonRef: b.nonRefDec,
  }));

  // 3-month branch trend
  const branchTrendData = filteredData.map(b => ({
    name: b.branch.substring(0, 8),
    Oct: b.refOct + b.nonRefOct,
    Nov: b.refNov + b.nonRefNov,
    Dec: b.refDec + b.nonRefDec,
  }));

  const exportColumns = [
    { key: "branch", label: "Branch" },
    { key: "refOct", label: "Ref Oct" },
    { key: "refNov", label: "Ref Nov" },
    { key: "refDec", label: "Ref Dec" },
    { key: "nonRefOct", label: "NonRef Oct" },
    { key: "nonRefNov", label: "NonRef Nov" },
    { key: "nonRefDec", label: "NonRef Dec" },
    { key: "total", label: "Total" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Referral & Non-Referral Report"
            description="3-month visual trend (Oct-Dec) – Branch-wise & Overall"
            icon={GitBranch}
            badge="3-Month View"
          />
          <ExcelDownloadButton data={filteredData} columns={exportColumns} filename="ref-nonref-report" />
        </div>

        <ReportFilters
          showBranch
          showDateRange
          filters={filters}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            title="Referral Revenue"
            value={`₹${totalRefDec.toFixed(1)}L`}
            change={`${((totalRefDec/grandTotal)*100).toFixed(0)}% of total`}
            changeType="positive"
            icon={Users}
          />
          <KPICard
            title="Non-Referral Revenue"
            value={`₹${totalNonRefDec.toFixed(1)}L`}
            change={`${((totalNonRefDec/grandTotal)*100).toFixed(0)}% of total`}
            changeType="neutral"
            icon={UserMinus}
          />
          <KPICard
            title="Best Ref Rate"
            value="Punjagutta"
            change="70% referral"
            changeType="positive"
            icon={TrendingUp}
          />
          <KPICard
            title="Avg Ref Rate"
            value={`${((totalRefDec/grandTotal)*100).toFixed(0)}%`}
            change="+2% vs Nov"
            changeType="positive"
            icon={GitBranch}
          />
        </div>

        {/* Visual representations - NO TABLE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Overall Pie */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Overall Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(1)}L`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 3-Month Trend Area */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">3-Month Trend (Oct–Dec)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRefTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNonRefTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toFixed(0)}L`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(1)}L`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="Referral" stroke="hsl(var(--success))" strokeWidth={2} fillOpacity={1} fill="url(#colorRefTrend)" />
                    <Area type="monotone" dataKey="NonReferral" name="Non-Referral" stroke="hsl(var(--chart-2))" strokeWidth={2} fillOpacity={1} fill="url(#colorNonRefTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Branch-wise Stacked Bar */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base md:text-lg">Branch-wise Referral Split</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchChartData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} angle={-45} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(1)}L`, '']} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Referral" fill="hsl(var(--success))" stackId="a" />
                  <Bar dataKey="NonRef" name="Non-Referral" fill="hsl(var(--chart-2))" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RefNonRef;
