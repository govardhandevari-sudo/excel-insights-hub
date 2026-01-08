import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, TrendingUp, Users, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const branchData = [
  { sno: 1, branch: "Punjagutta", ref: 72.5, refPct: 70, nonRef: 31.6, nonRefPct: 30, total: 104.1, bdHead: "Nagesh", date: new Date(2025, 11, 15) },
  { sno: 2, branch: "Kompally", ref: 68.6, refPct: 64, nonRef: 38.5, nonRefPct: 36, total: 107.1, bdHead: "Ganesh/Rakesh", date: new Date(2025, 11, 14) },
  { sno: 3, branch: "KPHB", ref: 60.5, refPct: 67, nonRef: 29.8, nonRefPct: 33, total: 90.3, bdHead: "Prasanth", date: new Date(2025, 11, 13) },
  { sno: 4, branch: "MBNR", ref: 23.2, refPct: 65, nonRef: 12.5, nonRefPct: 35, total: 35.7, bdHead: "Ramakrishna", date: new Date(2025, 11, 12) },
  { sno: 5, branch: "Sangareddy", ref: 19.0, refPct: 65, nonRef: 10.2, nonRefPct: 35, total: 29.2, bdHead: "Murali", date: new Date(2025, 11, 11) },
  { sno: 6, branch: "Nalgonda", ref: 13.9, refPct: 65, nonRef: 7.4, nonRefPct: 35, total: 21.3, bdHead: "Mallikarjun", date: new Date(2025, 11, 10) },
  { sno: 7, branch: "Nizamabad", ref: 21.2, refPct: 67, nonRef: 10.4, nonRefPct: 33, total: 31.6, bdHead: "Uma", date: new Date(2025, 11, 9) },
  { sno: 8, branch: "Medak", ref: 13.0, refPct: 65, nonRef: 7.0, nonRefPct: 35, total: 20.0, bdHead: "Srinivas E", date: new Date(2025, 11, 8) },
  { sno: 9, branch: "Santhanu", ref: 9.2, refPct: 65, nonRef: 5.0, nonRefPct: 35, total: 14.2, bdHead: "Sujeeth", date: new Date(2025, 11, 7) },
  { sno: 10, branch: "Jagtial", ref: 14.0, refPct: 67, nonRef: 6.9, nonRefPct: 33, total: 20.9, bdHead: "Dr. Sujith", date: new Date(2025, 11, 6) },
  { sno: 11, branch: "Rajahmundry", ref: 26.8, refPct: 67, nonRef: 13.2, nonRefPct: 33, total: 40.0, bdHead: "Satish", date: new Date(2025, 11, 5) },
  { sno: 12, branch: "Bangalore", ref: 68.4, refPct: 65, nonRef: 36.8, nonRefPct: 35, total: 105.2, bdHead: "Dr. Sreenath", date: new Date(2025, 11, 4) },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { key: "branch", label: "Branch", align: "left" },
  { key: "ref", label: "Ref (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { 
    key: "refPct", 
    label: "Ref %", 
    align: "center", 
    render: (v) => <Badge variant="secondary" className="bg-success/10 text-success">{v}%</Badge>
  },
  { key: "nonRef", label: "Non-Ref (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { 
    key: "nonRefPct", 
    label: "Non-Ref %", 
    align: "center", 
    render: (v) => <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">{v}%</Badge>
  },
  { key: "total", label: "Total", align: "right", render: (v) => <span className="font-semibold">₹{v.toFixed(1)}L</span> },
  { key: "bdHead", label: "BD Head", align: "left" },
];

const RefNonRef = () => {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return branchData.filter(item => {
      if (filters.branch && filters.branch !== "all" && item.branch.toLowerCase() !== filters.branch) return false;
      if (filters.dateFrom && item.date < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && item.date > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [filters]);

  const totalRef = filteredData.reduce((sum, b) => sum + b.ref, 0);
  const totalNonRef = filteredData.reduce((sum, b) => sum + b.nonRef, 0);
  const grandTotal = totalRef + totalNonRef;

  const pieData = [
    { name: "Referral", value: totalRef, color: "hsl(var(--success))" },
    { name: "Non-Referral", value: totalNonRef, color: "hsl(var(--chart-2))" },
  ];

  const chartData = filteredData.map(b => ({
    name: b.branch.substring(0, 6),
    Referral: b.ref,
    NonRef: b.nonRef,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title="Referral & Non-Referral Report"
          description="Revenue breakdown by referral source across branches"
          icon={GitBranch}
          badge="Daily"
        />

        <ReportFilters
          showBranch
          showDateRange
          filters={filters}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            title="Referral Revenue"
            value={`₹${totalRef.toFixed(1)}L`}
            change={`${((totalRef/grandTotal)*100).toFixed(0)}% of total`}
            changeType="positive"
            icon={Users}
          />
          <KPICard
            title="Non-Referral Revenue"
            value={`₹${totalNonRef.toFixed(1)}L`}
            change={`${((totalNonRef/grandTotal)*100).toFixed(0)}% of total`}
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
            value={`${((totalRef/grandTotal)*100).toFixed(0)}%`}
            change="+2% vs Nov"
            changeType="positive"
            icon={GitBranch}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Overall Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] md:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
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
                      formatter={(value) => [`₹${value.toFixed(1)}L`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Branch-wise Split (Stacked)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] md:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
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
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                      formatter={(value) => [`₹${value.toFixed(1)}L`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Referral" fill="hsl(var(--success))" stackId="a" />
                    <Bar dataKey="NonRef" name="Non-Referral" fill="hsl(var(--chart-2))" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title="Branch-wise Referral Breakdown"
          subtitle="December 2025 - All amounts in Lakhs"
          columns={columns}
          data={filteredData}
        />
      </div>
    </DashboardLayout>
  );
};

export default RefNonRef;
