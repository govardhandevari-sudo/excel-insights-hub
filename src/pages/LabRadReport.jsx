import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Activity, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const branchData = [
  { sno: 1, branch: "Punjagutta", labMTD: 24.4, labPct: 23, radMTD: 79.7, radPct: 77, total: 104.1, bdHead: "Nagesh", drilldownUrl: "/dept-revenue?branch=punjagutta" },
  { sno: 2, branch: "Kompally", labMTD: 44.6, labPct: 42, radMTD: 62.4, radPct: 58, total: 107.1, bdHead: "Ganesh/Rakesh", drilldownUrl: "/dept-revenue?branch=kompally" },
  { sno: 3, branch: "KPHB", labMTD: 20.9, labPct: 23, radMTD: 69.4, radPct: 77, total: 90.3, bdHead: "Prasanth", drilldownUrl: "/dept-revenue?branch=kphb" },
  { sno: 4, branch: "MBNR", labMTD: 12.5, labPct: 35, radMTD: 23.2, radPct: 65, total: 35.7, bdHead: "Ramakrishna", drilldownUrl: "/dept-revenue?branch=mbnr" },
  { sno: 5, branch: "Sangareddy", labMTD: 8.2, labPct: 28, radMTD: 21.0, radPct: 72, total: 29.2, bdHead: "Murali", drilldownUrl: "/dept-revenue?branch=sangareddy" },
  { sno: 6, branch: "Nalgonda", labMTD: 6.8, labPct: 32, radMTD: 14.5, radPct: 68, total: 21.3, bdHead: "Mallikarjun", drilldownUrl: "/dept-revenue?branch=nalgonda" },
  { sno: 7, branch: "Nizamabad", labMTD: 9.5, labPct: 30, radMTD: 22.1, radPct: 70, total: 31.6, bdHead: "Uma", drilldownUrl: "/dept-revenue?branch=nizamabad" },
  { sno: 8, branch: "Medak", labMTD: 5.2, labPct: 26, radMTD: 14.8, radPct: 74, total: 20.0, bdHead: "Srinivas E", drilldownUrl: "/dept-revenue?branch=medak" },
  { sno: 9, branch: "Santhanu", labMTD: 4.1, labPct: 29, radMTD: 10.1, radPct: 71, total: 14.2, bdHead: "Sujeeth", drilldownUrl: "/dept-revenue?branch=santhanu" },
  { sno: 10, branch: "Jagtial", labMTD: 6.9, labPct: 33, radMTD: 14.0, radPct: 67, total: 20.9, bdHead: "Dr. Sujith", drilldownUrl: "/dept-revenue?branch=jagtial" },
  { sno: 11, branch: "Rajahmundry", labMTD: 15.2, labPct: 38, radMTD: 24.8, radPct: 62, total: 40.0, bdHead: "Satish", drilldownUrl: "/dept-revenue?branch=rajahmundry" },
  { sno: 12, branch: "Bangalore", labMTD: 52.6, labPct: 50, radMTD: 52.6, radPct: 50, total: 105.2, bdHead: "Dr. Sreenath", drilldownUrl: "/dept-revenue?branch=bangalore" },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { key: "branch", label: "Branch", align: "left" },
  { key: "labMTD", label: "Lab (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { 
    key: "labPct", 
    label: "Lab %", 
    align: "center", 
    render: (v) => <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">{v}%</Badge>
  },
  { key: "radMTD", label: "Rad (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { 
    key: "radPct", 
    label: "Rad %", 
    align: "center", 
    render: (v) => <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">{v}%</Badge>
  },
  { key: "total", label: "Total", align: "right", render: (v) => <span className="font-semibold">₹{v.toFixed(1)}L</span> },
  { key: "bdHead", label: "BD Head", align: "left" },
];

const LabRadReport = () => {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return branchData.filter(item => {
      if (filters.branch && filters.branch !== "all" && item.branch.toLowerCase() !== filters.branch) return false;
      return true;
    });
  }, [filters]);

  const chartData = filteredData.map(b => ({
    name: b.branch.substring(0, 6),
    Lab: b.labMTD,
    Radiology: b.radMTD,
  }));

  const totalLab = filteredData.reduce((sum, b) => sum + b.labMTD, 0);
  const totalRad = filteredData.reduce((sum, b) => sum + b.radMTD, 0);
  const total = totalLab + totalRad;

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title="Lab & Radiology Report"
          description="Daily breakdown of Lab and Radiology revenue by branch"
          icon={FlaskConical}
          badge="Daily Report"
        />

        <ReportFilters
          showBranch
          showDateRange
          filters={filters}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            title="Total Lab Revenue"
            value={`₹${totalLab.toFixed(1)}L`}
            change={`${((totalLab/total)*100).toFixed(0)}% of total`}
            changeType="neutral"
            icon={FlaskConical}
            drilldownUrl="/dept-revenue"
          />
          <KPICard
            title="Total Radiology"
            value={`₹${totalRad.toFixed(1)}L`}
            change={`${((totalRad/total)*100).toFixed(0)}% of total`}
            changeType="neutral"
            icon={Activity}
            drilldownUrl="/dept-revenue"
          />
          <KPICard
            title="Highest Lab %"
            value="Bangalore"
            change="50% Lab contribution"
            changeType="positive"
            icon={TrendingUp}
            drilldownUrl="/dept-revenue?branch=bangalore"
          />
          <KPICard
            title="Highest Rad %"
            value="Punjagutta"
            change="77% Rad contribution"
            changeType="positive"
            icon={TrendingUp}
            drilldownUrl="/dept-revenue?branch=punjagutta"
          />
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base md:text-lg">Lab vs Radiology by Branch (Stacked)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[350px]">
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
                  <Bar dataKey="Lab" fill="hsl(var(--chart-1))" stackId="a" />
                  <Bar dataKey="Radiology" fill="hsl(var(--chart-2))" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Detailed Lab & Radiology Breakdown"
          subtitle="Month-to-date revenue split (December 2025) - Click rows to drill down"
          columns={columns}
          data={filteredData}
          rowClickable
        />
      </div>
    </DashboardLayout>
  );
};

export default LabRadReport;
