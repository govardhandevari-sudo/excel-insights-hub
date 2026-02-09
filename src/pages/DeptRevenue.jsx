import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const departmentData = [
  { sno: 1, category: "RADIOLOGY", isHeader: true },
  { sno: "", department: "MRI", w52: 28.5, w51: 26.2, w50: 27.8, mtd: 108.5, nov: 102.3, oct: 98.5, drilldownUrl: "/dept-volume?dept=mri" },
  { sno: "", department: "CT SCAN", w52: 22.3, w51: 20.8, w50: 21.5, mtd: 85.2, nov: 80.5, oct: 76.8, drilldownUrl: "/dept-volume?dept=ct-scan" },
  { sno: "", department: "ULTRASOUND", w52: 18.5, w51: 17.2, w50: 18.0, mtd: 70.5, nov: 66.8, oct: 64.2, drilldownUrl: "/dept-volume?dept=ultrasound" },
  { sno: "", department: "DOPPLER", w52: 8.2, w51: 7.5, w50: 8.0, mtd: 31.2, nov: 29.5, oct: 28.0, drilldownUrl: "/dept-volume?dept=doppler" },
  { sno: "", department: "MAMMOGRAPHY", w52: 5.8, w51: 5.2, w50: 5.5, mtd: 22.0, nov: 20.8, oct: 19.5, drilldownUrl: "/dept-volume?dept=mammography" },
  { sno: "", department: "XRAY", w52: 12.5, w51: 11.8, w50: 12.2, mtd: 47.5, nov: 45.0, oct: 43.2, drilldownUrl: "/dept-volume?dept=xray" },
  { sno: 2, category: "DENTAL", isHeader: true },
  { sno: "", department: "CBCT", w52: 6.2, w51: 5.8, w50: 6.0, mtd: 23.5, nov: 22.2, oct: 21.0, drilldownUrl: "/dept-volume?dept=cbct" },
  { sno: "", department: "OPG", w52: 4.5, w51: 4.2, w50: 4.3, mtd: 17.0, nov: 16.2, oct: 15.5, drilldownUrl: "/dept-volume?dept=opg" },
  { sno: 3, category: "ORTHO", isHeader: true },
  { sno: "", department: "DEXA", w52: 3.8, w51: 3.5, w50: 3.6, mtd: 14.2, nov: 13.5, oct: 12.8, drilldownUrl: "/dept-volume?dept=dexa" },
  { sno: 4, category: "LAB", isHeader: true },
  { sno: "", department: "BIOCHEMISTRY", w52: 35.2, w51: 33.5, w50: 34.8, mtd: 135.0, nov: 128.5, oct: 122.0, drilldownUrl: "/dept-volume?dept=biochemistry" },
  { sno: 5, category: "CARDIOLOGY", isHeader: true },
  { sno: "", department: "ECG", w52: 8.5, w51: 8.0, w50: 8.2, mtd: 32.5, nov: 30.8, oct: 29.2, drilldownUrl: "/dept-volume?dept=ecg" },
  { sno: "", department: "2D Echo", w52: 12.8, w51: 12.0, w50: 12.5, mtd: 48.8, nov: 46.2, oct: 44.0, drilldownUrl: "/dept-volume?dept=2d-echo" },
  { sno: "", department: "TMT", w52: 5.2, w51: 4.8, w50: 5.0, mtd: 19.8, nov: 18.8, oct: 17.8, drilldownUrl: "/dept-volume?dept=tmt" },
  { sno: 6, category: "NEURO", isHeader: true },
  { sno: "", department: "EEG", w52: 4.2, w51: 3.9, w50: 4.0, mtd: 16.0, nov: 15.2, oct: 14.5, drilldownUrl: "/dept-volume?dept=eeg" },
  { sno: "", department: "ENMG", w52: 2.8, w51: 2.5, w50: 2.6, mtd: 10.5, nov: 10.0, oct: 9.5, drilldownUrl: "/dept-volume?dept=enmg" },
  { sno: "", department: "NCS", w52: 2.5, w51: 2.3, w50: 2.4, mtd: 9.5, nov: 9.0, oct: 8.5, drilldownUrl: "/dept-volume?dept=ncs" },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { key: "department", label: "Department", align: "left", render: (v, row) => row.isHeader ? <span className="font-bold text-primary">{row.category}</span> : v },
  { key: "w52", label: "W52", align: "right", render: (v) => v ? `₹${v.toFixed(1)}L` : "" },
  { key: "w51", label: "W51", align: "right", render: (v) => v ? `₹${v.toFixed(1)}L` : "" },
  { key: "w50", label: "W50", align: "right", render: (v) => v ? `₹${v.toFixed(1)}L` : "" },
  { key: "mtd", label: "Dec MTD", align: "right", render: (v) => v ? <span className="font-semibold">₹{v.toFixed(1)}L</span> : "" },
  { key: "nov", label: "Nov '25", align: "right", render: (v) => v ? `₹${v.toFixed(1)}L` : "" },
  { key: "oct", label: "Oct '25", align: "right", render: (v) => v ? `₹${v.toFixed(1)}L` : "" },
];

const DeptRevenue = () => {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return departmentData.filter(item => {
      if (filters.department && filters.department !== "all" && !item.isHeader) {
        return item.department.toLowerCase().includes(filters.department);
      }
      return true;
    });
  }, [filters]);

  const actualData = filteredData.filter(d => !d.isHeader && d.mtd);
  const totalMTD = actualData.reduce((sum, d) => sum + (d.mtd || 0), 0);

  // Pie chart - department-wise
  const pieData = [
    { name: "Radiology", value: actualData.filter(d => ["MRI", "CT SCAN", "ULTRASOUND", "DOPPLER", "MAMMOGRAPHY", "XRAY"].includes(d.department)).reduce((s, d) => s + d.mtd, 0), color: "hsl(var(--chart-1))" },
    { name: "Lab", value: actualData.filter(d => d.department === "BIOCHEMISTRY").reduce((s, d) => s + d.mtd, 0), color: "hsl(var(--chart-2))" },
    { name: "Cardiology", value: actualData.filter(d => ["ECG", "2D Echo", "TMT"].includes(d.department)).reduce((s, d) => s + d.mtd, 0), color: "hsl(var(--chart-3))" },
    { name: "Dental", value: actualData.filter(d => ["CBCT", "OPG"].includes(d.department)).reduce((s, d) => s + d.mtd, 0), color: "hsl(var(--chart-4))" },
    { name: "Neuro", value: actualData.filter(d => ["EEG", "ENMG", "NCS"].includes(d.department)).reduce((s, d) => s + d.mtd, 0), color: "hsl(var(--chart-5))" },
    { name: "Ortho", value: actualData.filter(d => d.department === "DEXA").reduce((s, d) => s + d.mtd, 0), color: "hsl(var(--primary))" },
  ];

  // Modality breakdown within Radiology
  const radModalityData = actualData
    .filter(d => ["MRI", "CT SCAN", "ULTRASOUND", "DOPPLER", "MAMMOGRAPHY", "XRAY"].includes(d.department))
    .map(d => ({ name: d.department, value: d.mtd, color: "hsl(var(--chart-1))" }));

  // 3-month trend for top departments
  const trendData = actualData.sort((a, b) => b.mtd - a.mtd).slice(0, 5).map(d => ({
    name: d.department.substring(0, 6),
    Oct: d.oct,
    Nov: d.nov,
    Dec: d.mtd,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader title="Department Wise Revenue" description="Pie chart view with modality breakdown (3-Month Trend)" icon={Building2} badge="3-Month View" />

        <ReportFilters showBranch showDepartment showDateRange filters={filters} onFilterChange={setFilters} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard title="Total MTD Revenue" value={`₹${totalMTD.toFixed(1)}L`} change="+9.2% vs Nov" changeType="positive" icon={TrendingUp} />
          <KPICard title="Top Department" value="Biochemistry" change="₹135.0L MTD" changeType="positive" icon={Activity} drilldownUrl="/dept-volume?dept=biochemistry" />
          <KPICard title="Top Radiology" value="MRI" change="₹108.5L MTD" changeType="positive" icon={Building2} drilldownUrl="/dept-volume?dept=mri" />
          <KPICard title="Departments" value="18" change="Across 6 categories" changeType="neutral" icon={Building2} />
        </div>

        {/* Pie Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Department Category Pie */}
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Department-wise Revenue Split</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(1)}L`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Radiology Modality Breakdown */}
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Radiology → Modality Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={radModalityData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(1)}L`, 'Revenue']} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3-Month Trend */}
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Top Departments - 3 Month Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOctDR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorNovDR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorDecDR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value}L`, '']} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="Oct" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorOctDR)" />
                  <Area type="monotone" dataKey="Nov" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorNovDR)" />
                  <Area type="monotone" dataKey="Dec" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorDecDR)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Complete Department Revenue Summary"
          subtitle="All amounts in Lakhs - Click rows to drill down"
          columns={columns}
          data={filteredData}
          rowClickable
          exportFilename="dept-revenue-report"
        />
      </div>
    </DashboardLayout>
  );
};

export default DeptRevenue;
