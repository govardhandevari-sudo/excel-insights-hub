import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const branchData = [
  { sno: 1, branch: "Punjagutta", labMTD: 24.4, labPct: 23, radMTD: 79.7, radPct: 77, total: 104.1, bdHead: "Nagesh" },
  { sno: 2, branch: "Kompally", labMTD: 44.6, labPct: 42, radMTD: 62.4, radPct: 58, total: 107.1, bdHead: "Ganesh/Rakesh" },
  { sno: 3, branch: "KPHB", labMTD: 20.9, labPct: 23, radMTD: 69.4, radPct: 77, total: 90.3, bdHead: "Prasanth" },
  { sno: 4, branch: "MBNR", labMTD: 12.5, labPct: 35, radMTD: 23.2, radPct: 65, total: 35.7, bdHead: "Ramakrishna" },
  { sno: 5, branch: "Sangareddy", labMTD: 8.2, labPct: 28, radMTD: 21.0, radPct: 72, total: 29.2, bdHead: "Murali" },
  { sno: 6, branch: "Nalgonda", labMTD: 6.8, labPct: 32, radMTD: 14.5, radPct: 68, total: 21.3, bdHead: "Mallikarjun" },
  { sno: 7, branch: "Nizamabad", labMTD: 9.5, labPct: 30, radMTD: 22.1, radPct: 70, total: 31.6, bdHead: "Uma" },
  { sno: 8, branch: "Medak", labMTD: 5.2, labPct: 26, radMTD: 14.8, radPct: 74, total: 20.0, bdHead: "Srinivas E" },
  { sno: 9, branch: "Santhanu", labMTD: 4.1, labPct: 29, radMTD: 10.1, radPct: 71, total: 14.2, bdHead: "Sujeeth" },
  { sno: 10, branch: "Jagtial", labMTD: 6.9, labPct: 33, radMTD: 14.0, radPct: 67, total: 20.9, bdHead: "Dr. Sujith" },
  { sno: 11, branch: "Rajahmundry", labMTD: 15.2, labPct: 38, radMTD: 24.8, radPct: 62, total: 40.0, bdHead: "Satish" },
  { sno: 12, branch: "Bangalore", labMTD: 52.6, labPct: 50, radMTD: 52.6, radPct: 50, total: 105.2, bdHead: "Dr. Sreenath" },
];

const chartData = branchData.map(b => ({
  name: b.branch.substring(0, 8),
  Lab: b.labMTD,
  Radiology: b.radMTD,
}));

const columns = [
  { key: "sno", label: "S.No", align: "center" as const },
  { key: "branch", label: "Branch", align: "left" as const },
  { key: "labMTD", label: "Lab (₹L)", align: "right" as const, render: (v: number) => `₹${v.toFixed(1)}L` },
  { 
    key: "labPct", 
    label: "Lab %", 
    align: "center" as const, 
    render: (v: number) => <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">{v}%</Badge>
  },
  { key: "radMTD", label: "Rad (₹L)", align: "right" as const, render: (v: number) => `₹${v.toFixed(1)}L` },
  { 
    key: "radPct", 
    label: "Rad %", 
    align: "center" as const, 
    render: (v: number) => <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">{v}%</Badge>
  },
  { key: "total", label: "Total", align: "right" as const, render: (v: number) => <span className="font-semibold">₹{v.toFixed(1)}L</span> },
  { key: "bdHead", label: "BD Head", align: "left" as const },
];

const LabRadReport = () => {
  const totalLab = branchData.reduce((sum, b) => sum + b.labMTD, 0);
  const totalRad = branchData.reduce((sum, b) => sum + b.radMTD, 0);
  const total = totalLab + totalRad;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Lab & Radiology Report"
          description="Daily breakdown of Lab and Radiology revenue by branch"
          icon={FlaskConical}
          badge="Daily Report"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Lab Revenue"
            value={`₹${totalLab.toFixed(1)}L`}
            change={`${((totalLab/total)*100).toFixed(0)}% of total`}
            changeType="neutral"
            icon={FlaskConical}
          />
          <KPICard
            title="Total Radiology"
            value={`₹${totalRad.toFixed(1)}L`}
            change={`${((totalRad/total)*100).toFixed(0)}% of total`}
            changeType="neutral"
            icon={Activity}
          />
          <KPICard
            title="Highest Lab %"
            value="Bangalore"
            change="50% Lab contribution"
            changeType="positive"
            icon={TrendingUp}
          />
          <KPICard
            title="Highest Rad %"
            value="Punjagutta"
            change="77% Rad contribution"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Lab vs Radiology by Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
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
                    formatter={(value: number) => [`₹${value.toFixed(1)}L`, '']}
                  />
                  <Legend />
                  <Bar dataKey="Lab" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Radiology" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Detailed Lab & Radiology Breakdown"
          subtitle="Month-to-date revenue split (December 2025)"
          columns={columns}
          data={branchData}
        />
      </div>
    </DashboardLayout>
  );
};

export default LabRadReport;
