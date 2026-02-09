import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, TrendingUp, Users, IndianRupee, UserPlus, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

// Sample data with all 31 days and modality breakdown
const salespersonDetailsData = {
  ganesh: {
    name: "GANESH",
    location: "Kompally",
    activeDocs: 15,
    inactiveDocs: 3,
    totalDocs: 18,
    target: 5.50,
    manager: "Regional Manager - Telangana",
    teamMembers: ["Rakesh", "Devender", "Goutham"],
    doctors: [
      { sno: 1, docId: "D1", docName: "Dr. Ramesh Kumar", d1: 0.80, d2: 0.50, d3: 0, d4: 0.60, d5: 0.90, d6: 0, d7: 0.70, d8: 0.40, d9: 0, d10: 0.55, d11: 0.80, d12: 0, d13: 0.65, d14: 0.45, d15: 0, d16: 0.70, d17: 0.50, d18: 0, d19: 0.60, d20: 0.80, d21: 0, d22: 0.55, d23: 0.40, d24: 0, d25: 0.70, d26: 0.50, d27: 0, d28: 0.65, d29: 0.45, d30: 0, d31: 0.50, decTotal: 12.55, nov: 11.80, oct: 10.50, mri: 5.2, ct: 3.8, lab: 2.5, others: 1.05, active: true },
      { sno: 2, docId: "D2", docName: "Dr. Srinivas Rao", d1: 0, d2: 1.20, d3: 0.80, d4: 0, d5: 0, d6: 1.10, d7: 0, d8: 0, d9: 0.90, d10: 0, d11: 0, d12: 1.00, d13: 0, d14: 0, d15: 0.85, d16: 0, d17: 0, d18: 1.10, d19: 0, d20: 0, d21: 0.90, d22: 0, d23: 0, d24: 1.00, d25: 0, d26: 0, d27: 0.95, d28: 0, d29: 0, d30: 1.05, d31: 0, decTotal: 10.85, nov: 10.20, oct: 9.50, mri: 4.5, ct: 3.2, lab: 2.1, others: 1.05, active: true },
      { sno: 3, docId: "D3", docName: "Dr. Lakshmi Devi", d1: 0.40, d2: 0, d3: 0.30, d4: 0, d5: 0.50, d6: 0, d7: 0.35, d8: 0, d9: 0.40, d10: 0, d11: 0.45, d12: 0, d13: 0.30, d14: 0, d15: 0.50, d16: 0, d17: 0.35, d18: 0, d19: 0.40, d20: 0, d21: 0.45, d22: 0, d23: 0.30, d24: 0, d25: 0.50, d26: 0, d27: 0.35, d28: 0, d29: 0.40, d30: 0, d31: 0.30, decTotal: 5.50, nov: 5.00, oct: 4.50, mri: 2.0, ct: 1.5, lab: 1.2, others: 0.80, active: true },
      { sno: 4, docId: "D4", docName: "Dr. Venkat Reddy", d1: 0, d2: 0, d3: 0.90, d4: 0.80, d5: 0, d6: 0, d7: 0, d8: 0.85, d9: 0, d10: 0, d11: 0, d12: 0.90, d13: 0, d14: 0.80, d15: 0, d16: 0, d17: 0.85, d18: 0, d19: 0, d20: 0.90, d21: 0, d22: 0, d23: 0.80, d24: 0, d25: 0, d26: 0.85, d27: 0, d28: 0.90, d29: 0, d30: 0, d31: 0.80, decTotal: 9.15, nov: 8.50, oct: 7.80, mri: 3.8, ct: 2.8, lab: 1.8, others: 0.75, active: true },
      { sno: 5, docId: "D5", docName: "Dr. Suresh Babu", d1: 0, d2: 0.60, d3: 0, d4: 0, d5: 0.70, d6: 0, d7: 0, d8: 0.55, d9: 0, d10: 0, d11: 0.65, d12: 0, d13: 0, d14: 0.50, d15: 0, d16: 0, d17: 0.60, d18: 0, d19: 0, d20: 0.70, d21: 0, d22: 0, d23: 0.55, d24: 0, d25: 0, d26: 0.65, d27: 0, d28: 0, d29: 0.50, d30: 0, d31: 0.60, decTotal: 6.60, nov: 6.00, oct: 5.50, mri: 2.5, ct: 2.0, lab: 1.4, others: 0.70, active: true },
      { sno: 6, docId: "D6", docName: "Dr. Priya Sharma", d1: 0.30, d2: 0, d3: 0, d4: 0.40, d5: 0, d6: 0.35, d7: 0, d8: 0.45, d9: 0, d10: 0.30, d11: 0, d12: 0.40, d13: 0, d14: 0.35, d15: 0, d16: 0.45, d17: 0, d18: 0.30, d19: 0, d20: 0.40, d21: 0, d22: 0.35, d23: 0, d24: 0.45, d25: 0, d26: 0.30, d27: 0, d28: 0.40, d29: 0, d30: 0.35, d31: 0, decTotal: 5.55, nov: 5.20, oct: 4.80, mri: 2.0, ct: 1.5, lab: 1.2, others: 0.85, active: true },
    ],
  },
};

// Generate fallback data for other salespersons
["rakesh", "prasanth", "nagesh", "ramakrishna", "devender", "madhav"].forEach(id => {
  if (!salespersonDetailsData[id]) {
    salespersonDetailsData[id] = {
      ...salespersonDetailsData.ganesh,
      name: id.toUpperCase(),
      location: id === "prasanth" || id === "madhav" ? "KPHB" : id === "nagesh" ? "Punjagutta" : id === "ramakrishna" ? "MBNR" : "Kompally",
      activeDocs: Math.floor(Math.random() * 10) + 8,
      inactiveDocs: Math.floor(Math.random() * 4),
      target: 3.00 + Math.random() * 2,
    };
    salespersonDetailsData[id].totalDocs = salespersonDetailsData[id].activeDocs + salespersonDetailsData[id].inactiveDocs;
  }
});

const SalespersonDetail = () => {
  const [searchParams] = useSearchParams();
  const salespersonId = searchParams.get("id") || "ganesh";
  const data = salespersonDetailsData[salespersonId.toLowerCase()] || salespersonDetailsData.ganesh;

  const totalDec = data.doctors.reduce((sum, d) => sum + d.decTotal, 0);
  const totalNov = data.doctors.reduce((sum, d) => sum + d.nov, 0);
  const totalOct = data.doctors.reduce((sum, d) => sum + d.oct, 0);
  const growth = totalNov > 0 ? ((totalDec - totalNov) / totalNov * 100) : 0;
  const achPct = data.target > 0 ? (totalDec / data.target * 100) : 0;

  // Daily totals for all 31 days
  const dailyChartData = Array.from({ length: 31 }, (_, i) => {
    const dayKey = `d${i + 1}`;
    const total = data.doctors.reduce((sum, d) => sum + (d[dayKey] || 0), 0);
    return { name: `${i + 1}`, value: total };
  });

  // Modality-wise revenue histogram
  const totalMRI = data.doctors.reduce((s, d) => s + (d.mri || 0), 0);
  const totalCT = data.doctors.reduce((s, d) => s + (d.ct || 0), 0);
  const totalLab = data.doctors.reduce((s, d) => s + (d.lab || 0), 0);
  const totalOthers = data.doctors.reduce((s, d) => s + (d.others || 0), 0);

  const modalityData = [
    { name: "MRI", revenue: totalMRI, volume: data.doctors.reduce((s, d) => s + (d.mriVol || 45), 0) },
    { name: "CT", revenue: totalCT, volume: data.doctors.reduce((s, d) => s + (d.ctVol || 35), 0) },
    { name: "Lab", revenue: totalLab, volume: data.doctors.reduce((s, d) => s + (d.labVol || 100), 0) },
    { name: "Others", revenue: totalOthers, volume: data.doctors.reduce((s, d) => s + (d.othersVol || 30), 0) },
  ];

  const modalityPieData = [
    { name: "MRI", value: totalMRI, color: "hsl(var(--chart-1))" },
    { name: "CT", value: totalCT, color: "hsl(var(--chart-2))" },
    { name: "Lab", value: totalLab, color: "hsl(var(--chart-3))" },
    { name: "Others", value: totalOthers, color: "hsl(var(--chart-4))" },
  ];

  // Monthly trend
  const monthlyTrendData = data.doctors.slice(0, 5).map(d => ({
    name: d.docName.replace("Dr. ", "").substring(0, 10),
    Oct: d.oct,
    Nov: d.nov,
    Dec: d.decTotal,
  }));

  // Generate columns for all 31 days (shown in table)
  const dayColumns = Array.from({ length: 31 }, (_, i) => ({
    key: `d${i + 1}`,
    label: `${i + 1}`,
    align: "right",
    render: (v) => v > 0 ? `₹${v.toFixed(2)}L` : "-",
  }));

  const columns = [
    { key: "sno", label: "S.No", align: "center" },
    { key: "docName", label: "Doctor Name", align: "left" },
    ...dayColumns,
    { key: "decTotal", label: "Dec'25", align: "right", render: (v) => <span className="font-semibold text-primary">₹{v.toFixed(2)}L</span> },
    { key: "nov", label: "Nov'25", align: "right", render: (v) => `₹${v.toFixed(2)}L` },
    { key: "oct", label: "Oct'25", align: "right", render: (v) => `₹${v.toFixed(2)}L` },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title={`${data.name} - Detailed Performance`}
          description={`${data.location} Branch | ${data.manager || ''}`}
          icon={UserCheck}
          badge="Individual View"
        />

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
          <KPICard title="Dec'25 Revenue" value={`₹${totalDec.toFixed(2)}L`} change={`${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% vs Nov`} changeType={growth >= 0 ? "positive" : "negative"} icon={IndianRupee} />
          <KPICard title="Target" value={`₹${data.target.toFixed(2)}L`} change={`${achPct.toFixed(1)}% achieved`} changeType={achPct >= 85 ? "positive" : "neutral"} icon={TrendingUp} />
          <KPICard title="Active Docs" value={data.activeDocs.toString()} change="Currently active" changeType="positive" icon={Users} />
          <KPICard title="Inactive Docs" value={data.inactiveDocs.toString()} change="Need attention" changeType={data.inactiveDocs > 0 ? "negative" : "neutral"} icon={UserMinus} />
          <KPICard title="Total Doctors" value={data.totalDocs.toString()} change="All referrals" changeType="neutral" icon={UserPlus} />
          <KPICard title="Location" value={data.location} icon={Users} />
        </div>

        {/* Daily Revenue - All 31 Days */}
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Daily Revenue - All Days in December</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(2)}L`, 'Revenue']} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Modality-wise Revenue & Volume Histogram */}
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Modality-wise Revenue & Volume</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modalityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹L)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="volume" name="Volume" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Doctor-wise Monthly Comparison */}
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Doctor-wise 3-Month Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOctD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorNovD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorDecD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(2)}L`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="Oct" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorOctD)" />
                    <Area type="monotone" dataKey="Nov" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorNovD)" />
                    <Area type="monotone" dataKey="Dec" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorDecD)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manager View - Team Performance */}
        {data.teamMembers && data.teamMembers.length > 0 && (
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Manager View - Team Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.teamMembers.map((member, i) => (
                  <div key={member} className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">{i + 1}</div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{member}</p>
                        <p className="text-xs text-muted-foreground">{data.location}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">MTD Revenue</span><span className="font-semibold">₹{(2.5 + i * 0.4).toFixed(2)}L</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Target</span><span>₹{(3.0 + i * 0.3).toFixed(2)}L</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Achievement</span><Badge variant="secondary" className="bg-success/10 text-success text-[10px]">{(82 + i * 2).toFixed(1)}%</Badge></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <DataTable
          title="Doctor-wise Revenue Details (All 31 Days)"
          subtitle={`NET AMT | Active: ${data.activeDocs} | Inactive: ${data.inactiveDocs}`}
          columns={columns}
          data={data.doctors}
          exportFilename={`${data.name}-doctor-revenue`}
        />

        {/* Summary */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-muted-foreground">TOTAL:</span>
              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="text-center"><div className="text-xs text-muted-foreground">Dec'25</div><div className="font-bold text-primary">₹{totalDec.toFixed(2)}L</div></div>
                <div className="text-center"><div className="text-xs text-muted-foreground">Nov'25</div><div className="font-semibold">₹{totalNov.toFixed(2)}L</div></div>
                <div className="text-center"><div className="text-xs text-muted-foreground">Oct'25</div><div className="font-semibold">₹{totalOct.toFixed(2)}L</div></div>
                <div className="text-center"><div className="text-xs text-muted-foreground">Growth</div><Badge variant="secondary" className={growth >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>{growth >= 0 ? "+" : ""}{growth.toFixed(1)}%</Badge></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalespersonDetail;
