import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Activity, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";

const volumeData = [
  { sno: 1, category: "RADIOLOGY", isHeader: true },
  { sno: "", department: "MRI", w52: 285, w51: 262, w50: 278, mtd: 1085, nov: 1023, oct: 985 },
  { sno: "", department: "CT SCAN", w52: 445, w51: 416, w50: 430, mtd: 1704, nov: 1610, oct: 1536 },
  { sno: "", department: "ULTRASOUND", w52: 620, w51: 573, w50: 600, mtd: 2350, nov: 2227, oct: 2140 },
  { sno: "", department: "DOPPLER", w52: 164, w51: 150, w50: 160, mtd: 624, nov: 590, oct: 560 },
  { sno: "", department: "MAMMOGRAPHY", w52: 116, w51: 104, w50: 110, mtd: 440, nov: 416, oct: 390 },
  { sno: "", department: "XRAY", w52: 830, w51: 787, w50: 813, mtd: 3167, nov: 3000, oct: 2880 },
  { sno: 2, category: "DENTAL", isHeader: true },
  { sno: "", department: "CBCT", w52: 124, w51: 116, w50: 120, mtd: 470, nov: 444, oct: 420 },
  { sno: "", department: "OPG", w52: 225, w51: 210, w50: 215, mtd: 850, nov: 810, oct: 775 },
  { sno: 3, category: "ORTHO", isHeader: true },
  { sno: "", department: "DEXA", w52: 95, w51: 88, w50: 90, mtd: 355, nov: 338, oct: 320 },
  { sno: 4, category: "LAB", isHeader: true },
  { sno: "", department: "BIOCHEMISTRY", w52: 3520, w51: 3350, w50: 3480, mtd: 13500, nov: 12850, oct: 12200 },
  { sno: 5, category: "CARDIOLOGY", isHeader: true },
  { sno: "", department: "ECG", w52: 425, w51: 400, w50: 410, mtd: 1625, nov: 1540, oct: 1460 },
  { sno: "", department: "2D Echo", w52: 256, w51: 240, w50: 250, mtd: 976, nov: 924, oct: 880 },
  { sno: "", department: "TMT", w52: 104, w51: 96, w50: 100, mtd: 396, nov: 376, oct: 356 },
  { sno: 6, category: "NEURO", isHeader: true },
  { sno: "", department: "EEG", w52: 84, w51: 78, w50: 80, mtd: 320, nov: 304, oct: 290 },
  { sno: "", department: "ENMG", w52: 56, w51: 50, w50: 52, mtd: 210, nov: 200, oct: 190 },
  { sno: "", department: "NCS", w52: 50, w51: 46, w50: 48, mtd: 190, nov: 180, oct: 170 },
];

const chartData = [
  { name: "Biochem", value: 13500 },
  { name: "X-Ray", value: 3167 },
  { name: "Ultrasound", value: 2350 },
  { name: "CT Scan", value: 1704 },
  { name: "ECG", value: 1625 },
  { name: "MRI", value: 1085 },
];

const trendData = [
  { name: "Biochem", oct: 12200, nov: 12850, dec: 13500 },
  { name: "X-Ray", oct: 2880, nov: 3000, dec: 3167 },
  { name: "USG", oct: 2140, nov: 2227, dec: 2350 },
  { name: "CT", oct: 1536, nov: 1610, dec: 1704 },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { 
    key: "department", 
    label: "Department", 
    align: "left",
    render: (v, row) => row.isHeader ? <span className="font-bold text-primary">{row.category}</span> : v
  },
  { key: "w52", label: "W52", align: "right", render: (v) => v ? v.toLocaleString() : "" },
  { key: "w51", label: "W51", align: "right", render: (v) => v ? v.toLocaleString() : "" },
  { key: "w50", label: "W50", align: "right", render: (v) => v ? v.toLocaleString() : "" },
  { key: "mtd", label: "Dec MTD", align: "right", render: (v) => v ? <span className="font-semibold">{v.toLocaleString()}</span> : "" },
  { key: "nov", label: "Nov '25", align: "right", render: (v) => v ? v.toLocaleString() : "" },
  { key: "oct", label: "Oct '25", align: "right", render: (v) => v ? v.toLocaleString() : "" },
];

const DeptVolume = () => {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return volumeData.filter(item => {
      if (filters.department && filters.department !== "all" && !item.isHeader) {
        return item.department.toLowerCase().includes(filters.department);
      }
      return true;
    });
  }, [filters]);

  const totalVolume = filteredData.filter(d => !d.isHeader && d.mtd).reduce((sum, d) => sum + (d.mtd || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title="Department Wise Volume"
          description="Patient volume summary by department and service type"
          icon={BarChart3}
          badge="Daily"
        />

        <ReportFilters
          showBranch
          showDepartment
          showDateRange
          filters={filters}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            title="Total Tests MTD"
            value={totalVolume.toLocaleString()}
            change="+8.5% vs Nov"
            changeType="positive"
            icon={Activity}
          />
          <KPICard
            title="Top Volume"
            value="Biochemistry"
            change="13,500 tests"
            changeType="positive"
            icon={TrendingUp}
          />
          <KPICard
            title="Top Radiology"
            value="X-Ray"
            change="3,167 scans"
            changeType="positive"
            icon={BarChart3}
          />
          <KPICard
            title="Daily Avg"
            value={Math.round(totalVolume / 29).toLocaleString()}
            change="Tests per day"
            changeType="neutral"
            icon={Users}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Top Departments by Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => v.toLocaleString()}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
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
                      formatter={(value) => [value.toLocaleString(), 'Tests']}
                    />
                    <Bar dataKey="value" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Monthly Volume Trend (Area)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOctVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNovVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDecVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                      formatter={(value) => [value.toLocaleString(), '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="oct" name="Oct" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorOctVol)" />
                    <Area type="monotone" dataKey="nov" name="Nov" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorNovVol)" />
                    <Area type="monotone" dataKey="dec" name="Dec" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorDecVol)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title="Complete Department Volume Summary"
          subtitle="Hourly data pull - Test counts by department"
          columns={columns}
          data={filteredData}
        />
      </div>
    </DashboardLayout>
  );
};

export default DeptVolume;
