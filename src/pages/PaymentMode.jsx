import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, Banknote, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const branchData = [
  { sno: 1, branch: "Punjagutta", credit: 35.2, creditPct: 34, upiCards: 48.5, upiCardsPct: 47, cash: 20.4, cashPct: 19, total: 104.1 },
  { sno: 2, branch: "Kompally", credit: 32.1, creditPct: 30, upiCards: 53.6, upiCardsPct: 50, cash: 21.4, cashPct: 20, total: 107.1 },
  { sno: 3, branch: "KPHB", credit: 27.1, creditPct: 30, upiCards: 45.2, upiCardsPct: 50, cash: 18.0, cashPct: 20, total: 90.3 },
  { sno: 4, branch: "MBNR", credit: 10.7, creditPct: 30, upiCards: 16.1, upiCardsPct: 45, cash: 8.9, cashPct: 25, total: 35.7 },
  { sno: 5, branch: "Sangareddy", credit: 8.2, creditPct: 28, upiCards: 13.1, upiCardsPct: 45, cash: 7.9, cashPct: 27, total: 29.2 },
  { sno: 6, branch: "Nalgonda", credit: 5.5, creditPct: 26, upiCards: 10.0, upiCardsPct: 47, cash: 5.8, cashPct: 27, total: 21.3 },
  { sno: 7, branch: "Nizamabad", credit: 9.5, creditPct: 30, upiCards: 14.2, upiCardsPct: 45, cash: 7.9, cashPct: 25, total: 31.6 },
  { sno: 8, branch: "Medak", credit: 5.6, creditPct: 28, upiCards: 9.0, upiCardsPct: 45, cash: 5.4, cashPct: 27, total: 20.0 },
  { sno: 9, branch: "Santhanu", credit: 3.7, creditPct: 26, upiCards: 6.5, upiCardsPct: 46, cash: 4.0, cashPct: 28, total: 14.2 },
  { sno: 10, branch: "Jagtial", credit: 5.9, creditPct: 28, upiCards: 9.6, upiCardsPct: 46, cash: 5.4, cashPct: 26, total: 20.9 },
  { sno: 11, branch: "Rajahmundry", credit: 12.0, creditPct: 30, upiCards: 18.0, upiCardsPct: 45, cash: 10.0, cashPct: 25, total: 40.0 },
  { sno: 12, branch: "Bangalore", credit: 36.8, creditPct: 35, upiCards: 47.4, upiCardsPct: 45, cash: 21.0, cashPct: 20, total: 105.2 },
];

const totalCredit = branchData.reduce((sum, b) => sum + b.credit, 0);
const totalUPI = branchData.reduce((sum, b) => sum + b.upiCards, 0);
const totalCash = branchData.reduce((sum, b) => sum + b.cash, 0);
const grandTotal = totalCredit + totalUPI + totalCash;

const pieData = [
  { name: "Credit", value: totalCredit, color: "hsl(var(--chart-1))" },
  { name: "UPI/Cards", value: totalUPI, color: "hsl(var(--chart-2))" },
  { name: "Cash", value: totalCash, color: "hsl(var(--chart-3))" },
];

const stackedChartData = branchData.map(b => ({
  name: b.branch.substring(0, 6),
  Credit: b.credit,
  UPI: b.upiCards,
  Cash: b.cash,
}));

const columns = [
  { key: "sno", label: "S.No", align: "center" },
  { key: "branch", label: "Branch", align: "left" },
  { key: "credit", label: "Credit (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { 
    key: "creditPct", 
    label: "Credit %", 
    align: "center", 
    render: (v) => <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">{v}%</Badge>
  },
  { key: "upiCards", label: "UPI/Cards (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { 
    key: "upiCardsPct", 
    label: "UPI %", 
    align: "center", 
    render: (v) => <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">{v}%</Badge>
  },
  { key: "cash", label: "Cash (₹L)", align: "right", render: (v) => `₹${v.toFixed(1)}L` },
  { 
    key: "cashPct", 
    label: "Cash %", 
    align: "center", 
    render: (v) => <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">{v}%</Badge>
  },
  { key: "total", label: "Total", align: "right", render: (v) => <span className="font-semibold">₹{v.toFixed(1)}L</span> },
];

const PaymentMode = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <PageHeader
          title="Payment Mode Report"
          description="Revenue breakdown by payment method across branches"
          icon={CreditCard}
          badge="Daily/Weekly"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            title="Credit Payments"
            value={`₹${totalCredit.toFixed(1)}L`}
            change={`${((totalCredit/grandTotal)*100).toFixed(0)}% of total`}
            changeType="neutral"
            icon={CreditCard}
          />
          <KPICard
            title="UPI/Card Payments"
            value={`₹${totalUPI.toFixed(1)}L`}
            change={`${((totalUPI/grandTotal)*100).toFixed(0)}% of total`}
            changeType="positive"
            icon={Wallet}
          />
          <KPICard
            title="Cash Payments"
            value={`₹${totalCash.toFixed(1)}L`}
            change={`${((totalCash/grandTotal)*100).toFixed(0)}% of total`}
            changeType="neutral"
            icon={Banknote}
          />
          <KPICard
            title="Digital Adoption"
            value={`${(((totalUPI+totalCredit)/grandTotal)*100).toFixed(0)}%`}
            change="+5% vs last month"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Payment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] md:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
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
                      formatter={(value) => [`₹${value.toFixed(1)}L`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base md:text-lg">Branch-wise Payment Mix (Stacked)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] md:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stackedChartData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
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
                    <Bar dataKey="Credit" fill="hsl(var(--chart-1))" stackId="a" />
                    <Bar dataKey="UPI" fill="hsl(var(--chart-2))" stackId="a" />
                    <Bar dataKey="Cash" fill="hsl(var(--chart-3))" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title="Branch-wise Payment Mode Breakdown"
          subtitle="December 2025 - All amounts in Lakhs"
          columns={columns}
          data={branchData}
        />
      </div>
    </DashboardLayout>
  );
};

export default PaymentMode;
