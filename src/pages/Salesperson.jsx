import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, TrendingUp, Target, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, Legend, PieChart, Pie } from "recharts";

const salespersonData = [
  { sno: "", location: "KOMPALLY", isHeader: true },
  { sno: 1, name: "Ganesh", location: "Kompally", mtd: 4.82, target: 5.50, achPct: 87.6, oct: 3.95, nov: 4.28, newDocs: 3, totalDocs: 18, docContrib: 22, mri: 1.5, ct: 1.2, lab: 1.1, others: 1.02, mriVol: 45, ctVol: 38, labVol: 120, id: "ganesh" },
  { sno: 2, name: "Rakesh", location: "Kompally", mtd: 3.42, target: 4.00, achPct: 85.5, oct: 2.69, nov: 2.97, newDocs: 2, totalDocs: 14, docContrib: 18, mri: 1.1, ct: 0.9, lab: 0.8, others: 0.62, mriVol: 32, ctVol: 28, labVol: 95, id: "rakesh" },
  { sno: 3, name: "Devender", location: "Kompally", mtd: 2.85, target: 3.30, achPct: 86.4, oct: 2.48, nov: 2.63, newDocs: 1, totalDocs: 12, docContrib: 15, mri: 0.9, ct: 0.8, lab: 0.7, others: 0.45, mriVol: 28, ctVol: 24, labVol: 80, id: "devender" },
  { sno: "", location: "KPHB", isHeader: true },
  { sno: 4, name: "Prasanth", location: "KPHB", mtd: 3.95, target: 4.50, achPct: 87.8, oct: 3.44, nov: 3.66, newDocs: 2, totalDocs: 16, docContrib: 20, mri: 1.3, ct: 1.0, lab: 0.9, others: 0.75, mriVol: 40, ctVol: 30, labVol: 105, id: "prasanth" },
  { sno: 5, name: "Madhav", location: "KPHB", mtd: 2.56, target: 3.00, achPct: 85.3, oct: 2.41, nov: 2.48, newDocs: 1, totalDocs: 10, docContrib: 13, mri: 0.8, ct: 0.7, lab: 0.6, others: 0.46, mriVol: 24, ctVol: 22, labVol: 70, id: "madhav" },
  { sno: "", location: "PUNJAGUTTA", isHeader: true },
  { sno: 6, name: "Nagesh", location: "Punjagutta", mtd: 3.53, target: 4.00, achPct: 88.3, oct: 3.05, nov: 3.20, newDocs: 2, totalDocs: 15, docContrib: 18, mri: 1.2, ct: 0.9, lab: 0.8, others: 0.63, mriVol: 35, ctVol: 28, labVol: 90, id: "nagesh" },
  { sno: "", location: "MBNR", isHeader: true },
  { sno: 7, name: "Ramakrishna", location: "MBNR", mtd: 1.66, target: 1.90, achPct: 87.4, oct: 1.42, nov: 1.54, newDocs: 1, totalDocs: 8, docContrib: 8, mri: 0.5, ct: 0.4, lab: 0.4, others: 0.36, mriVol: 15, ctVol: 12, labVol: 45, id: "ramakrishna" },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { key: "name", label: "Name", align: "left", render: (v, row) => row.isHeader ? <span className="font-bold text-primary">{row.location}</span> : v },
  { key: "location", label: "Location", align: "left", render: (v, row) => row.isHeader ? "" : v },
  { key: "mtd", label: "Dec MTD (₹L)", align: "right", render: (v) => v ? `₹${v.toFixed(2)}L` : "" },
  { key: "target", label: "Target (₹L)", align: "right", render: (v) => v ? `₹${v.toFixed(2)}L` : "" },
  { key: "achPct", label: "Achieved %", align: "center", render: (v) => v ? <Badge variant="secondary" className={v >= 85 ? "bg-success/10 text-success" : v >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}>{v.toFixed(1)}%</Badge> : "" },
  { key: "newDocs", label: "New Docs", align: "center", render: (v) => v !== undefined ? <Badge variant="outline" className="text-primary">{v}</Badge> : "" },
  { key: "docContrib", label: "Doc Contrib %", align: "center", render: (v) => v ? `${v}%` : "" },
  { key: "nov", label: "Nov '25", align: "right", render: (v) => v ? `₹${v.toFixed(2)}L` : "" },
  { key: "oct", label: "Oct '25", align: "right", render: (v) => v ? `₹${v.toFixed(2)}L` : "" },
];

const Salesperson = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return salespersonData.filter(item => {
      if (filters.branch && filters.branch !== "all") {
        if (item.isHeader) return item.location.toLowerCase() === filters.branch;
        return item.location.toLowerCase() === filters.branch;
      }
      if (filters.salesperson && filters.salesperson !== "all" && !item.isHeader) {
        return item.name.toLowerCase() === filters.salesperson;
      }
      return true;
    });
  }, [filters]);

  const actualData = filteredData.filter(s => !s.isHeader);

  // Top performers for charts
  const topPerformers = [...actualData].sort((a, b) => (b.mtd || 0) - (a.mtd || 0)).slice(0, 6);

  // 3-month trend
  const trendData = topPerformers.map(s => ({ name: s.name, Oct: s.oct, Nov: s.nov, Dec: s.mtd }));

  // Target vs Achieved
  const targetData = topPerformers.map(s => ({ name: s.name, Target: s.target, Achieved: s.mtd }));

  // Modality-wise revenue (aggregated)
  const totalMRI = actualData.reduce((s, d) => s + (d.mri || 0), 0);
  const totalCT = actualData.reduce((s, d) => s + (d.ct || 0), 0);
  const totalLab = actualData.reduce((s, d) => s + (d.lab || 0), 0);
  const totalOthers = actualData.reduce((s, d) => s + (d.others || 0), 0);
  const modalityPieData = [
    { name: "MRI", value: totalMRI, color: "hsl(var(--chart-1))" },
    { name: "CT", value: totalCT, color: "hsl(var(--chart-2))" },
    { name: "Lab", value: totalLab, color: "hsl(var(--chart-3))" },
    { name: "Others", value: totalOthers, color: "hsl(var(--chart-4))" },
  ];

  const totalMTD = actualData.reduce((sum, s) => sum + (s.mtd || 0), 0);
  const totalTarget = actualData.reduce((sum, s) => sum + (s.target || 0), 0);
  const totalNewDocs = actualData.reduce((sum, s) => sum + (s.newDocs || 0), 0);
  const avgAchPct = totalTarget > 0 ? (totalMTD / totalTarget * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader title="Salesperson Performance" description="3-Month trend with Target vs Achieved, Modality & Doctor metrics" icon={UserCheck} badge="3-Month View" />

        <ReportFilters showBranch showSalesperson showDateRange filters={filters} onFilterChange={setFilters} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard title="Team Revenue" value={`₹${totalMTD.toFixed(1)}L`} change={`${avgAchPct.toFixed(1)}% of target`} changeType={avgAchPct >= 85 ? "positive" : "neutral"} icon={TrendingUp} />
          <KPICard title="Target vs Achieved" value={`${avgAchPct.toFixed(1)}%`} change={`₹${totalTarget.toFixed(1)}L target`} changeType={avgAchPct >= 85 ? "positive" : "neutral"} icon={Target} />
          <KPICard title="New Doctors Added" value={totalNewDocs.toString()} change="This month" changeType="positive" icon={UserPlus} />
          <KPICard title="Top Performer" value={topPerformers[0]?.name || "N/A"} change={`₹${topPerformers[0]?.mtd?.toFixed(2) || 0}L MTD`} changeType="positive" icon={UserCheck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Target vs Achieved */}
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Target vs Achieved</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={targetData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(2)}L`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Target" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.4} />
                    <Bar dataKey="Achieved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 3-Month Trend */}
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">3-Month Trend (Top Performers)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOctS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorNovS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorDecS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(2)}L`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="Oct" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorOctS)" />
                    <Area type="monotone" dataKey="Nov" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorNovS)" />
                    <Area type="monotone" dataKey="Dec" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorDecS)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modality Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Modality-wise Revenue</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={modalityPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                      {modalityPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(1)}L`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Contribution */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Doctor Contribution % by Salesperson</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPerformers.map(s => ({ name: s.name, contribution: s.docContrib, newDocs: s.newDocs }))} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value, name) => [name === 'contribution' ? `${value}%` : value, name === 'contribution' ? 'Contribution' : 'New Docs']} />
                    <Bar dataKey="contribution" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title="Detailed Salesperson Performance"
          subtitle="Click on a salesperson to view individual details"
          columns={columns}
          data={filteredData}
          rowClickable
          onRowClick={(row) => { if (!row.isHeader && row.id) navigate(`/salesperson-detail?id=${row.id}`); }}
          exportFilename="salesperson-performance"
        />
      </div>
    </DashboardLayout>
  );
};

export default Salesperson;
