import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, TrendingUp, Users, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";

// Sample data based on Excel Sheet 2 - Salesperson Detailed Performance
const salespersonDetailsData = {
  ganesh: {
    name: "GANESH",
    location: "Kompally",
    docCount: 6,
    doctors: [
      { sno: 1, docId: "D1", docName: "Dr. Ramesh Kumar", d1: 2.00, d2: 0, d3: 0, d4: 0, d5: 5.00, d6: 0, decTotal: 7.00, nov: 6.50, oct: 5.80 },
      { sno: 2, docId: "D2", docName: "Dr. Srinivas Rao", d1: 0, d2: 6.70, d3: 0, d4: 0, d5: 0, d6: 4.50, decTotal: 11.20, nov: 10.50, oct: 9.80 },
      { sno: 3, docId: "D3", docName: "Dr. Lakshmi Devi", d1: 3.00, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, decTotal: 3.00, nov: 2.80, oct: 2.50 },
      { sno: 4, docId: "D4", docName: "Dr. Venkat Reddy", d1: 0, d2: 0, d3: 8.00, d4: 0, d5: 0, d6: 3.00, decTotal: 11.00, nov: 10.20, oct: 9.50 },
      { sno: 5, docId: "D5", docName: "Dr. Suresh Babu", d1: 0, d2: 0, d3: 0, d4: 9.00, d5: 0, d6: 0, decTotal: 9.00, nov: 8.50, oct: 7.80 },
      { sno: 6, docId: "D6", docName: "Dr. Priya Sharma", d1: 0, d2: 0, d3: 0, d4: 0, d5: 7.00, d6: 0, decTotal: 7.00, nov: 6.80, oct: 6.20 },
    ],
    dailyTotals: { d1: 5.00, d2: 6.70, d3: 8.00, d4: 9.00, d5: 12.00, d6: 7.50 }
  },
  rakesh: {
    name: "RAKESH",
    location: "Kompally",
    docCount: 4,
    doctors: [
      { sno: 1, docId: "D7", docName: "Dr. Anil Kumar", d1: 1.50, d2: 0, d3: 2.00, d4: 0, d5: 0, d6: 1.80, decTotal: 5.30, nov: 4.80, oct: 4.50 },
      { sno: 2, docId: "D8", docName: "Dr. Meena Kumari", d1: 0, d2: 3.20, d3: 0, d4: 2.50, d5: 0, d6: 0, decTotal: 5.70, nov: 5.20, oct: 4.80 },
      { sno: 3, docId: "D9", docName: "Dr. Ravi Teja", d1: 2.00, d2: 0, d3: 0, d4: 0, d5: 3.50, d6: 0, decTotal: 5.50, nov: 5.00, oct: 4.60 },
      { sno: 4, docId: "D10", docName: "Dr. Kavitha Reddy", d1: 0, d2: 1.80, d3: 0, d4: 0, d5: 0, d6: 2.20, decTotal: 4.00, nov: 3.60, oct: 3.20 },
    ],
    dailyTotals: { d1: 3.50, d2: 5.00, d3: 2.00, d4: 2.50, d5: 3.50, d6: 4.00 }
  },
  prasanth: {
    name: "PRASANTH",
    location: "KPHB",
    docCount: 5,
    doctors: [
      { sno: 1, docId: "D11", docName: "Dr. Naresh Gupta", d1: 2.50, d2: 0, d3: 1.80, d4: 0, d5: 2.00, d6: 0, decTotal: 6.30, nov: 5.80, oct: 5.50 },
      { sno: 2, docId: "D12", docName: "Dr. Sujatha Rani", d1: 0, d2: 4.00, d3: 0, d4: 3.20, d5: 0, d6: 2.50, decTotal: 9.70, nov: 9.00, oct: 8.50 },
      { sno: 3, docId: "D13", docName: "Dr. Kiran Kumar", d1: 1.80, d2: 0, d3: 2.50, d4: 0, d5: 1.50, d6: 0, decTotal: 5.80, nov: 5.30, oct: 5.00 },
      { sno: 4, docId: "D14", docName: "Dr. Padma Reddy", d1: 0, d2: 2.80, d3: 0, d4: 2.00, d5: 0, d6: 1.80, decTotal: 6.60, nov: 6.00, oct: 5.60 },
      { sno: 5, docId: "D15", docName: "Dr. Sunil Varma", d1: 2.00, d2: 0, d3: 1.50, d4: 0, d5: 2.50, d6: 0, decTotal: 6.00, nov: 5.50, oct: 5.20 },
    ],
    dailyTotals: { d1: 6.30, d2: 6.80, d3: 5.80, d4: 5.20, d5: 6.00, d6: 4.30 }
  },
  nagesh: {
    name: "NAGESH",
    location: "Punjagutta",
    docCount: 4,
    doctors: [
      { sno: 1, docId: "D16", docName: "Dr. Mohan Rao", d1: 3.00, d2: 2.50, d3: 0, d4: 2.80, d5: 0, d6: 3.20, decTotal: 11.50, nov: 10.80, oct: 10.20 },
      { sno: 2, docId: "D17", docName: "Dr. Lakshmi Bai", d1: 0, d2: 3.50, d3: 2.80, d4: 0, d5: 3.00, d6: 0, decTotal: 9.30, nov: 8.80, oct: 8.30 },
      { sno: 3, docId: "D18", docName: "Dr. Raju Naidu", d1: 2.20, d2: 0, d3: 1.80, d4: 2.50, d5: 0, d6: 2.00, decTotal: 8.50, nov: 8.00, oct: 7.50 },
      { sno: 4, docId: "D19", docName: "Dr. Sunitha Devi", d1: 0, d2: 2.00, d3: 0, d4: 1.80, d5: 2.20, d6: 0, decTotal: 6.00, nov: 5.50, oct: 5.10 },
    ],
    dailyTotals: { d1: 5.20, d2: 8.00, d3: 4.60, d4: 7.10, d5: 5.20, d6: 5.20 }
  },
  ramakrishna: {
    name: "RAMAKRISHNA",
    location: "MBNR",
    docCount: 3,
    doctors: [
      { sno: 1, docId: "D20", docName: "Dr. Vijay Kumar", d1: 1.50, d2: 0, d3: 1.80, d4: 0, d5: 2.00, d6: 1.50, decTotal: 6.80, nov: 6.30, oct: 5.90 },
      { sno: 2, docId: "D21", docName: "Dr. Anita Rao", d1: 0, d2: 2.00, d3: 0, d4: 1.50, d5: 0, d6: 1.80, decTotal: 5.30, nov: 4.90, oct: 4.50 },
      { sno: 3, docId: "D22", docName: "Dr. Srinivas Murthy", d1: 1.20, d2: 0, d3: 1.50, d4: 0, d5: 1.80, d6: 0, decTotal: 4.50, nov: 4.10, oct: 3.80 },
    ],
    dailyTotals: { d1: 2.70, d2: 2.00, d3: 3.30, d4: 1.50, d5: 3.80, d6: 3.30 }
  },
};

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { key: "docId", label: "Doc ID", align: "center" },
  { key: "docName", label: "Doctor Name", align: "left" },
  { key: "d1", label: "1-Dec", align: "right", render: (v) => v > 0 ? `₹${v.toFixed(2)}L` : "-" },
  { key: "d2", label: "2-Dec", align: "right", render: (v) => v > 0 ? `₹${v.toFixed(2)}L` : "-" },
  { key: "d3", label: "3-Dec", align: "right", render: (v) => v > 0 ? `₹${v.toFixed(2)}L` : "-" },
  { key: "d4", label: "4-Dec", align: "right", render: (v) => v > 0 ? `₹${v.toFixed(2)}L` : "-" },
  { key: "d5", label: "5-Dec", align: "right", render: (v) => v > 0 ? `₹${v.toFixed(2)}L` : "-" },
  { key: "d6", label: "6-Dec", align: "right", render: (v) => v > 0 ? `₹${v.toFixed(2)}L` : "-" },
  { 
    key: "decTotal", 
    label: "Dec'25", 
    align: "right", 
    render: (v) => (
      <span className="font-semibold text-primary">₹{v.toFixed(2)}L</span>
    )
  },
  { key: "nov", label: "Nov'25", align: "right", render: (v) => `₹${v.toFixed(2)}L` },
  { key: "oct", label: "Oct'25", align: "right", render: (v) => `₹${v.toFixed(2)}L` },
];

const SalespersonDetail = () => {
  const [searchParams] = useSearchParams();
  const salespersonId = searchParams.get("id") || "ganesh";
  
  const data = salespersonDetailsData[salespersonId.toLowerCase()] || salespersonDetailsData.ganesh;
  
  const totalDec = data.doctors.reduce((sum, d) => sum + d.decTotal, 0);
  const totalNov = data.doctors.reduce((sum, d) => sum + d.nov, 0);
  const totalOct = data.doctors.reduce((sum, d) => sum + d.oct, 0);
  const growth = totalNov > 0 ? ((totalDec - totalNov) / totalNov * 100) : 0;

  // Chart data for daily performance
  const dailyChartData = [
    { name: "1-Dec", value: data.dailyTotals.d1 },
    { name: "2-Dec", value: data.dailyTotals.d2 },
    { name: "3-Dec", value: data.dailyTotals.d3 },
    { name: "4-Dec", value: data.dailyTotals.d4 },
    { name: "5-Dec", value: data.dailyTotals.d5 },
    { name: "6-Dec", value: data.dailyTotals.d6 },
  ];

  // Monthly trend data
  const monthlyTrendData = data.doctors.map(d => ({
    name: d.docName.replace("Dr. ", "").substring(0, 10),
    Oct: d.oct,
    Nov: d.nov,
    Dec: d.decTotal,
  }));

  // Top doctors sorted by December total
  const topDoctors = [...data.doctors].sort((a, b) => b.decTotal - a.decTotal).slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title={`${data.name} - Detailed Performance`}
          description={`Doctor-wise revenue breakdown for ${data.location} branch`}
          icon={UserCheck}
          badge="Salesperson Report"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            title="Location"
            value={data.location}
            icon={Users}
          />
          <KPICard
            title="Dec'25 Total"
            value={`₹${totalDec.toFixed(2)}L`}
            change={`${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% vs Nov`}
            changeType={growth >= 0 ? "positive" : "negative"}
            icon={IndianRupee}
          />
          <KPICard
            title="Doctor Count"
            value={data.docCount.toString()}
            change="Active referrals"
            changeType="neutral"
            icon={Users}
          />
          <KPICard
            title="Top Doctor"
            value={topDoctors[0]?.docName.replace("Dr. ", "")}
            change={`₹${topDoctors[0]?.decTotal.toFixed(2)}L`}
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Daily Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] md:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                      tickFormatter={(v) => `₹${v}L`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                      formatter={(value) => [`₹${value.toFixed(2)}L`, 'Revenue']}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Doctor-wise Monthly Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] md:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOct" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNov" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${v}L`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                      formatter={(value) => [`₹${value.toFixed(2)}L`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="Oct" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorOct)" />
                    <Area type="monotone" dataKey="Nov" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorNov)" />
                    <Area type="monotone" dataKey="Dec" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorDec)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title="Doctor-wise Revenue Details"
          subtitle={`All amounts in Lakhs (₹) | NET AMT - Doctor Count: ${data.docCount}`}
          columns={columns}
          data={data.doctors}
        />

        {/* Summary Row */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">TOTAL:</span>
              </div>
              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Dec'25</div>
                  <div className="font-bold text-primary">₹{totalDec.toFixed(2)}L</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Nov'25</div>
                  <div className="font-semibold">₹{totalNov.toFixed(2)}L</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Oct'25</div>
                  <div className="font-semibold">₹{totalOct.toFixed(2)}L</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Growth</div>
                  <Badge variant="secondary" className={growth >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                    {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalespersonDetail;
