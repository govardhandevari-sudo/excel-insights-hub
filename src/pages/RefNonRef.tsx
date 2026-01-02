import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, TrendingUp, Users, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const branchData = [
  { sno: 1, branch: "Punjagutta", ref: 72.5, refPct: 70, nonRef: 31.6, nonRefPct: 30, total: 104.1, bdHead: "Nagesh" },
  { sno: 2, branch: "Kompally", ref: 68.6, refPct: 64, nonRef: 38.5, nonRefPct: 36, total: 107.1, bdHead: "Ganesh/Rakesh" },
  { sno: 3, branch: "KPHB", ref: 60.5, refPct: 67, nonRef: 29.8, nonRefPct: 33, total: 90.3, bdHead: "Prasanth" },
  { sno: 4, branch: "MBNR", ref: 23.2, refPct: 65, nonRef: 12.5, nonRefPct: 35, total: 35.7, bdHead: "Ramakrishna" },
  { sno: 5, branch: "Sangareddy", ref: 19.0, refPct: 65, nonRef: 10.2, nonRefPct: 35, total: 29.2, bdHead: "Murali" },
  { sno: 6, branch: "Nalgonda", ref: 13.9, refPct: 65, nonRef: 7.4, nonRefPct: 35, total: 21.3, bdHead: "Mallikarjun" },
  { sno: 7, branch: "Nizamabad", ref: 21.2, refPct: 67, nonRef: 10.4, nonRefPct: 33, total: 31.6, bdHead: "Uma" },
  { sno: 8, branch: "Medak", ref: 13.0, refPct: 65, nonRef: 7.0, nonRefPct: 35, total: 20.0, bdHead: "Srinivas E" },
  { sno: 9, branch: "Santhanu", ref: 9.2, refPct: 65, nonRef: 5.0, nonRefPct: 35, total: 14.2, bdHead: "Sujeeth" },
  { sno: 10, branch: "Jagtial", ref: 14.0, refPct: 67, nonRef: 6.9, nonRefPct: 33, total: 20.9, bdHead: "Dr. Sujith" },
  { sno: 11, branch: "Rajahmundry", ref: 26.8, refPct: 67, nonRef: 13.2, nonRefPct: 33, total: 40.0, bdHead: "Satish" },
  { sno: 12, branch: "Bangalore", ref: 68.4, refPct: 65, nonRef: 36.8, nonRefPct: 35, total: 105.2, bdHead: "Dr. Sreenath" },
];

const totalRef = branchData.reduce((sum, b) => sum + b.ref, 0);
const totalNonRef = branchData.reduce((sum, b) => sum + b.nonRef, 0);
const grandTotal = totalRef + totalNonRef;

const pieData = [
  { name: "Referral", value: totalRef, color: "hsl(var(--success))" },
  { name: "Non-Referral", value: totalNonRef, color: "hsl(var(--chart-2))" },
];

const chartData = branchData.map(b => ({
  name: b.branch.substring(0, 8),
  Referral: b.ref,
  NonRef: b.nonRef,
}));

const columns = [
  { key: "sno", label: "S.No", align: "center" as const },
  { key: "branch", label: "Branch", align: "left" as const },
  { key: "ref", label: "Ref (₹L)", align: "right" as const, render: (v: number) => `₹${v.toFixed(1)}L` },
  { 
    key: "refPct", 
    label: "Ref %", 
    align: "center" as const, 
    render: (v: number) => <Badge variant="secondary" className="bg-success/10 text-success">{v}%</Badge>
  },
  { key: "nonRef", label: "Non-Ref (₹L)", align: "right" as const, render: (v: number) => `₹${v.toFixed(1)}L` },
  { 
    key: "nonRefPct", 
    label: "Non-Ref %", 
    align: "center" as const, 
    render: (v: number) => <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">{v}%</Badge>
  },
  { key: "total", label: "Total", align: "right" as const, render: (v: number) => <span className="font-semibold">₹{v.toFixed(1)}L</span> },
  { key: "bdHead", label: "BD Head", align: "left" as const },
];

const RefNonRef = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Referral & Non-Referral Report"
          description="Revenue breakdown by referral source across branches"
          icon={GitBranch}
          badge="Daily"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <CardTitle className="font-heading text-lg">Overall Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
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
                      formatter={(value: number) => [`₹${value.toFixed(1)}L`, '']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg">Branch-wise Split</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
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
                    <Bar dataKey="Referral" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="NonRef" name="Non-Referral" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} stackId="a" />
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
          data={branchData}
        />
      </div>
    </DashboardLayout>
  );
};

export default RefNonRef;
