import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { TrendingUp, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const branchData = [
  { sno: 1, state: "TS", branch: "Punjagutta", w52: 12.5, w51: 11.8, w50: 13.2, mtdPlan: 50.0, mtdAch: 42.5, achPct: 85.0, gap: -7.5, bdHead: "Nagesh" },
  { sno: 2, state: "TS", branch: "Kompally", w52: 9.8, w51: 8.5, w50: 10.2, mtdPlan: 40.0, mtdAch: 35.2, achPct: 88.0, gap: -4.8, bdHead: "Ganesh/Rakesh" },
  { sno: 3, state: "TS", branch: "KPHB", w52: 11.2, w51: 10.5, w50: 11.8, mtdPlan: 45.0, mtdAch: 38.5, achPct: 85.6, gap: -6.5, bdHead: "Prasanth" },
  { sno: 4, state: "TS", branch: "MBNR", w52: 5.4, w51: 4.8, w50: 5.2, mtdPlan: 22.0, mtdAch: 18.5, achPct: 84.1, gap: -3.5, bdHead: "Ramakrishna" },
  { sno: 5, state: "TS", branch: "Nalgonda", w52: 4.2, w51: 3.9, w50: 4.5, mtdPlan: 18.0, mtdAch: 15.2, achPct: 84.4, gap: -2.8, bdHead: "Mallikarjun" },
  { sno: 6, state: "TS", branch: "Nizamabad", w52: 6.1, w51: 5.5, w50: 6.3, mtdPlan: 25.0, mtdAch: 21.8, achPct: 87.2, gap: -3.2, bdHead: "Uma" },
  { sno: 7, state: "TS", branch: "Medak", w52: 4.8, w51: 4.2, w50: 5.0, mtdPlan: 20.0, mtdAch: 16.5, achPct: 82.5, gap: -3.5, bdHead: "Srinivas E" },
  { sno: 8, state: "TS", branch: "Sangareddy", w52: 5.2, w51: 4.8, w50: 5.5, mtdPlan: 22.0, mtdAch: 18.2, achPct: 82.7, gap: -3.8, bdHead: "Murali" },
  { sno: 9, state: "TS", branch: "Santhanu", w52: 3.8, w51: 3.5, w50: 4.0, mtdPlan: 16.0, mtdAch: 13.5, achPct: 84.4, gap: -2.5, bdHead: "Sujeeth" },
  { sno: 10, state: "TS", branch: "Jagtial", w52: 4.5, w51: 4.0, w50: 4.8, mtdPlan: 18.0, mtdAch: 15.8, achPct: 87.8, gap: -2.2, bdHead: "Dr. Sujith" },
  { sno: 11, state: "AP", branch: "Rajahmundry", w52: 7.2, w51: 6.5, w50: 7.5, mtdPlan: 30.0, mtdAch: 25.5, achPct: 85.0, gap: -4.5, bdHead: "Satish" },
  { sno: 12, state: "KA", branch: "Bangalore", w52: 15.5, w51: 14.2, w50: 16.0, mtdPlan: 65.0, mtdAch: 55.8, achPct: 85.8, gap: -9.2, bdHead: "Dr. Sreenath" },
];

const columns = [
  { key: "sno", label: "S.No", align: "center" as const },
  { key: "state", label: "State", align: "center" as const },
  { key: "branch", label: "Branch", align: "left" as const },
  { key: "w52", label: "W52", align: "right" as const, render: (v: number) => `₹${v.toFixed(1)}L` },
  { key: "w51", label: "W51", align: "right" as const, render: (v: number) => `₹${v.toFixed(1)}L` },
  { key: "w50", label: "W50", align: "right" as const, render: (v: number) => `₹${v.toFixed(1)}L` },
  { key: "mtdPlan", label: "MTD Plan", align: "right" as const, render: (v: number) => `₹${v.toFixed(1)}L` },
  { key: "mtdAch", label: "MTD Ach.", align: "right" as const, render: (v: number) => `₹${v.toFixed(1)}L` },
  { 
    key: "achPct", 
    label: "Ach %", 
    align: "center" as const, 
    render: (v: number) => (
      <Badge 
        variant="secondary" 
        className={v >= 85 ? "bg-success/10 text-success" : v >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}
      >
        {v.toFixed(1)}%
      </Badge>
    )
  },
  { 
    key: "gap", 
    label: "GAP", 
    align: "right" as const, 
    render: (v: number) => (
      <span className={v >= 0 ? "text-success" : "text-destructive"}>
        {v >= 0 ? "+" : ""}₹{v.toFixed(1)}L
      </span>
    )
  },
  { key: "bdHead", label: "BD Head", align: "left" as const },
];

const DailyRevenue = () => {
  const totalMTD = branchData.reduce((sum, b) => sum + b.mtdAch, 0);
  const totalPlan = branchData.reduce((sum, b) => sum + b.mtdPlan, 0);
  const avgAch = (totalMTD / totalPlan) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Daily Revenue Report"
          description="Branch-wise revenue performance across all states"
          icon={TrendingUp}
          badge="Daily Report"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total MTD Achievement"
            value={`₹${totalMTD.toFixed(1)}L`}
            change={`${avgAch.toFixed(1)}% of target`}
            changeType="neutral"
            icon={TrendingUp}
          />
          <KPICard
            title="Total MTD Plan"
            value={`₹${totalPlan.toFixed(1)}L`}
            icon={Target}
          />
          <KPICard
            title="Best Performer"
            value="Kompally"
            change="88.0% achievement"
            changeType="positive"
            icon={ArrowUpRight}
          />
          <KPICard
            title="Needs Attention"
            value="Medak"
            change="82.5% achievement"
            changeType="negative"
            icon={ArrowDownRight}
          />
        </div>

        <DataTable
          title="Branch-wise Revenue Summary"
          subtitle="All amounts in Lakhs (₹)"
          columns={columns}
          data={branchData}
        />
      </div>
    </DashboardLayout>
  );
};

export default DailyRevenue;
