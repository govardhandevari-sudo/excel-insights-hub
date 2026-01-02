import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const departmentData = [
  { sno: 1, category: "RADIOLOGY", isHeader: true },
  { sno: "", department: "MRI", w52: 28.5, w51: 26.2, w50: 27.8, mtd: 108.5, nov: 102.3, oct: 98.5 },
  { sno: "", department: "CT SCAN", w52: 22.3, w51: 20.8, w50: 21.5, mtd: 85.2, nov: 80.5, oct: 76.8 },
  { sno: "", department: "ULTRASOUND", w52: 18.5, w51: 17.2, w50: 18.0, mtd: 70.5, nov: 66.8, oct: 64.2 },
  { sno: "", department: "DOPPLER", w52: 8.2, w51: 7.5, w50: 8.0, mtd: 31.2, nov: 29.5, oct: 28.0 },
  { sno: "", department: "MAMMOGRAPHY", w52: 5.8, w51: 5.2, w50: 5.5, mtd: 22.0, nov: 20.8, oct: 19.5 },
  { sno: "", department: "XRAY", w52: 12.5, w51: 11.8, w50: 12.2, mtd: 47.5, nov: 45.0, oct: 43.2 },
  { sno: 2, category: "DENTAL", isHeader: true },
  { sno: "", department: "CBCT", w52: 6.2, w51: 5.8, w50: 6.0, mtd: 23.5, nov: 22.2, oct: 21.0 },
  { sno: "", department: "OPG", w52: 4.5, w51: 4.2, w50: 4.3, mtd: 17.0, nov: 16.2, oct: 15.5 },
  { sno: 3, category: "ORTHO", isHeader: true },
  { sno: "", department: "DEXA", w52: 3.8, w51: 3.5, w50: 3.6, mtd: 14.2, nov: 13.5, oct: 12.8 },
  { sno: 4, category: "LAB", isHeader: true },
  { sno: "", department: "BIOCHEMISTRY", w52: 35.2, w51: 33.5, w50: 34.8, mtd: 135.0, nov: 128.5, oct: 122.0 },
  { sno: 5, category: "CARDIOLOGY", isHeader: true },
  { sno: "", department: "ECG", w52: 8.5, w51: 8.0, w50: 8.2, mtd: 32.5, nov: 30.8, oct: 29.2 },
  { sno: "", department: "2D Echo", w52: 12.8, w51: 12.0, w50: 12.5, mtd: 48.8, nov: 46.2, oct: 44.0 },
  { sno: "", department: "TMT", w52: 5.2, w51: 4.8, w50: 5.0, mtd: 19.8, nov: 18.8, oct: 17.8 },
  { sno: 6, category: "NEURO", isHeader: true },
  { sno: "", department: "EEG", w52: 4.2, w51: 3.9, w50: 4.0, mtd: 16.0, nov: 15.2, oct: 14.5 },
  { sno: "", department: "ENMG", w52: 2.8, w51: 2.5, w50: 2.6, mtd: 10.5, nov: 10.0, oct: 9.5 },
  { sno: "", department: "NCS", w52: 2.5, w51: 2.3, w50: 2.4, mtd: 9.5, nov: 9.0, oct: 8.5 },
];

const chartData = [
  { name: "MRI", value: 108.5 },
  { name: "Biochemistry", value: 135.0 },
  { name: "CT Scan", value: 85.2 },
  { name: "Ultrasound", value: 70.5 },
  { name: "2D Echo", value: 48.8 },
  { name: "X-Ray", value: 47.5 },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" as const },
  { 
    key: "department", 
    label: "Department", 
    align: "left" as const,
    render: (v: string, row: any) => row.isHeader ? <span className="font-bold text-primary">{row.category}</span> : v
  },
  { key: "w52", label: "W52", align: "right" as const, render: (v: number) => v ? `₹${v.toFixed(1)}L` : "" },
  { key: "w51", label: "W51", align: "right" as const, render: (v: number) => v ? `₹${v.toFixed(1)}L` : "" },
  { key: "w50", label: "W50", align: "right" as const, render: (v: number) => v ? `₹${v.toFixed(1)}L` : "" },
  { key: "mtd", label: "Dec MTD", align: "right" as const, render: (v: number) => v ? <span className="font-semibold">₹{v.toFixed(1)}L</span> : "" },
  { key: "nov", label: "Nov '25", align: "right" as const, render: (v: number) => v ? `₹${v.toFixed(1)}L` : "" },
  { key: "oct", label: "Oct '25", align: "right" as const, render: (v: number) => v ? `₹${v.toFixed(1)}L` : "" },
];

const DeptRevenue = () => {
  const totalMTD = departmentData.filter(d => !d.isHeader && d.mtd).reduce((sum, d) => sum + (d.mtd || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Department Wise Revenue"
          description="Revenue summary by medical department and service"
          icon={Building2}
          badge="Daily"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total MTD Revenue"
            value={`₹${totalMTD.toFixed(1)}L`}
            change="+9.2% vs Nov"
            changeType="positive"
            icon={TrendingUp}
          />
          <KPICard
            title="Top Department"
            value="Biochemistry"
            change="₹135.0L MTD"
            changeType="positive"
            icon={Activity}
          />
          <KPICard
            title="Top Radiology"
            value="MRI"
            change="₹108.5L MTD"
            changeType="positive"
            icon={Building2}
          />
          <KPICard
            title="Departments"
            value="18"
            change="Across 6 categories"
            changeType="neutral"
            icon={Building2}
          />
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Top Departments by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}L`}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
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
                    formatter={(value: number) => [`₹${value.toFixed(1)}L`, 'Revenue']}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Complete Department Revenue Summary"
          subtitle="Hourly data pull - All amounts in Lakhs"
          columns={columns}
          data={departmentData}
        />
      </div>
    </DashboardLayout>
  );
};

export default DeptRevenue;
