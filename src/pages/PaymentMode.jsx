import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, Banknote, TrendingUp, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";

const branchData = [
  { sno: 1, branch: "Punjagutta", cash: 15.6, upi: 31.2, card: 22.1, credit: 35.2, total: 104.1, cashOct: 14.0, cashNov: 15.0, upiOct: 28.5, upiNov: 30.0, cardOct: 20.0, cardNov: 21.0, creditOct: 33.5, creditNov: 34.5 },
  { sno: 2, branch: "Kompally", cash: 16.1, upi: 34.3, card: 24.6, credit: 32.1, total: 107.1, cashOct: 14.5, cashNov: 15.5, upiOct: 31.0, upiNov: 33.0, cardOct: 22.0, cardNov: 23.5, creditOct: 30.0, creditNov: 31.0 },
  { sno: 3, branch: "KPHB", cash: 13.6, upi: 27.1, card: 22.5, credit: 27.1, total: 90.3, cashOct: 12.0, cashNov: 13.0, upiOct: 24.5, upiNov: 26.0, cardOct: 20.0, cardNov: 21.5, creditOct: 25.0, creditNov: 26.0 },
  { sno: 4, branch: "MBNR", cash: 7.1, upi: 10.7, card: 7.2, credit: 10.7, total: 35.7, cashOct: 6.0, cashNov: 6.5, upiOct: 9.5, upiNov: 10.0, cardOct: 6.5, cardNov: 7.0, creditOct: 9.5, creditNov: 10.0 },
  { sno: 5, branch: "Sangareddy", cash: 5.8, upi: 8.8, card: 6.4, credit: 8.2, total: 29.2, cashOct: 5.0, cashNov: 5.5, upiOct: 8.0, upiNov: 8.5, cardOct: 5.8, cardNov: 6.0, creditOct: 7.5, creditNov: 8.0 },
  { sno: 6, branch: "Nalgonda", cash: 4.3, upi: 6.4, card: 5.1, credit: 5.5, total: 21.3, cashOct: 3.5, cashNov: 4.0, upiOct: 5.8, upiNov: 6.0, cardOct: 4.5, cardNov: 4.8, creditOct: 5.0, creditNov: 5.2 },
  { sno: 7, branch: "Nizamabad", cash: 6.3, upi: 9.5, card: 6.3, credit: 9.5, total: 31.6, cashOct: 5.5, cashNov: 6.0, upiOct: 8.5, upiNov: 9.0, cardOct: 5.5, cardNov: 6.0, creditOct: 8.5, creditNov: 9.0 },
  { sno: 8, branch: "Rajahmundry", cash: 8.0, upi: 12.0, card: 8.0, credit: 12.0, total: 40.0, cashOct: 7.0, cashNov: 7.5, upiOct: 10.5, upiNov: 11.5, cardOct: 7.0, cardNov: 7.5, creditOct: 11.0, creditNov: 11.5 },
  { sno: 9, branch: "Bangalore", cash: 15.8, upi: 31.6, card: 21.0, credit: 36.8, total: 105.2, cashOct: 14.0, cashNov: 15.0, upiOct: 28.5, upiNov: 30.5, cardOct: 19.0, cardNov: 20.0, creditOct: 34.0, creditNov: 35.5 },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { key: "branch", label: "Branch", align: "left" },
  { key: "cash", label: "Cash (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { key: "upi", label: "UPI (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { key: "card", label: "Card (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { key: "credit", label: "Credit (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { key: "total", label: "Total", align: "right", render: (v) => <span className="font-semibold">₹{v.toFixed(1)}L</span> },
];

const PaymentMode = () => {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return branchData.filter(item => {
      if (filters.branch && filters.branch !== "all" && item.branch.toLowerCase() !== filters.branch) return false;
      return true;
    });
  }, [filters]);

  const totalCash = filteredData.reduce((sum, b) => sum + b.cash, 0);
  const totalUPI = filteredData.reduce((sum, b) => sum + b.upi, 0);
  const totalCard = filteredData.reduce((sum, b) => sum + b.card, 0);
  const totalCredit = filteredData.reduce((sum, b) => sum + b.credit, 0);
  const grandTotal = totalCash + totalUPI + totalCard + totalCredit;

  const pieData = [
    { name: "Cash", value: totalCash, color: "hsl(var(--chart-3))" },
    { name: "UPI", value: totalUPI, color: "hsl(var(--chart-2))" },
    { name: "Card", value: totalCard, color: "hsl(var(--chart-4))" },
    { name: "Credit", value: totalCredit, color: "hsl(var(--chart-1))" },
  ];

  // 3-month trend
  const trendData = [
    { month: "Oct", Cash: filteredData.reduce((s,b) => s+b.cashOct,0), UPI: filteredData.reduce((s,b) => s+b.upiOct,0), Card: filteredData.reduce((s,b) => s+b.cardOct,0), Credit: filteredData.reduce((s,b) => s+b.creditOct,0) },
    { month: "Nov", Cash: filteredData.reduce((s,b) => s+b.cashNov,0), UPI: filteredData.reduce((s,b) => s+b.upiNov,0), Card: filteredData.reduce((s,b) => s+b.cardNov,0), Credit: filteredData.reduce((s,b) => s+b.creditNov,0) },
    { month: "Dec", Cash: totalCash, UPI: totalUPI, Card: totalCard, Credit: totalCredit },
  ];

  const stackedChartData = filteredData.map(b => ({
    name: b.branch.substring(0, 6),
    Cash: b.cash,
    UPI: b.upi,
    Card: b.card,
    Credit: b.credit,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title="Payment Mode Report"
          description="Cash / UPI / Card / Credit breakdown – Branch-wise (3-Month Trend)"
          icon={CreditCard}
          badge="3-Month View"
        />

        <ReportFilters
          showBranch
          showDateRange
          filters={filters}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard title="Cash" value={`₹${totalCash.toFixed(1)}L`} change={`${((totalCash/grandTotal)*100).toFixed(0)}%`} changeType="neutral" icon={Banknote} />
          <KPICard title="UPI" value={`₹${totalUPI.toFixed(1)}L`} change={`${((totalUPI/grandTotal)*100).toFixed(0)}%`} changeType="positive" icon={Smartphone} />
          <KPICard title="Card" value={`₹${totalCard.toFixed(1)}L`} change={`${((totalCard/grandTotal)*100).toFixed(0)}%`} changeType="neutral" icon={CreditCard} />
          <KPICard title="Credit" value={`₹${totalCredit.toFixed(1)}L`} change={`${((totalCredit/grandTotal)*100).toFixed(0)}%`} changeType="neutral" icon={Wallet} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Payment Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(1)}L`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">3-Month Payment Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toFixed(0)}L`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(1)}L`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Cash" fill="hsl(var(--chart-3))" stackId="a" />
                    <Bar dataKey="UPI" fill="hsl(var(--chart-2))" stackId="a" />
                    <Bar dataKey="Card" fill="hsl(var(--chart-4))" stackId="a" />
                    <Bar dataKey="Credit" fill="hsl(var(--chart-1))" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Branch-wise Stacked */}
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="font-heading text-base md:text-lg">Branch-wise Payment Mix</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedChartData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} angle={-45} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`₹${value.toFixed(1)}L`, '']} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Cash" fill="hsl(var(--chart-3))" stackId="a" />
                  <Bar dataKey="UPI" fill="hsl(var(--chart-2))" stackId="a" />
                  <Bar dataKey="Card" fill="hsl(var(--chart-4))" stackId="a" />
                  <Bar dataKey="Credit" fill="hsl(var(--chart-1))" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Branch-wise Payment Mode Breakdown"
          subtitle="December 2025 - All amounts in Lakhs"
          columns={columns}
          data={filteredData}
          exportFilename="payment-mode-report"
        />
      </div>
    </DashboardLayout>
  );
};

export default PaymentMode;
