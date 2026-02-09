import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { BranchRevenueChart } from "@/components/dashboard/BranchRevenueChart";
import { LabRadSplitChart } from "@/components/dashboard/LabRadSplitChart";
import { RevenueTrendChart } from "@/components/dashboard/RevenueTrendChart";
import { TopPerformersCard } from "@/components/dashboard/TopPerformersCard";
import { PaymentModeChart } from "@/components/dashboard/PaymentModeChart";
import { DepartmentHeatMap } from "@/components/dashboard/DepartmentHeatMap";
import { RefNonRefPieChart } from "@/components/dashboard/RefNonRefPieChart";
import { VolumeSummaryChart } from "@/components/dashboard/VolumeSummaryChart";
import { ThreeMonthTrendChart } from "@/components/dashboard/ThreeMonthTrendChart";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Building2, 
  Activity,
  ArrowUpRight,
} from "lucide-react";

const Dashboard = () => {
  const [filters, setFilters] = useState({});

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-heading text-foreground">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              MegSan Diagnostics - Performance Overview (3-Month Trend)
            </p>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters
          showBranch
          showState
          showDateRange
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            title="MTD Revenue"
            value="₹21.12L"
            change="+12.5%"
            changeType="positive"
            icon={TrendingUp}
            subtitle="vs last month"
            drilldownUrl="/revenue"
          />
          <KPICard
            title="MTD Target"
            value="₹25.00L"
            change="84.5% achieved"
            changeType="neutral"
            icon={Target}
            drilldownUrl="/revenue"
          />
          <KPICard
            title="Total Patients"
            value="8,542"
            change="+5.2%"
            changeType="positive"
            icon={Users}
            subtitle="this month"
            drilldownUrl="/avg-realisation"
          />
          <KPICard
            title="Active Branches"
            value="12"
            change="3 states"
            changeType="neutral"
            icon={Building2}
            drilldownUrl="/revenue"
          />
        </div>

        {/* Row 1 - 3-Month Revenue Trend & Branch Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ThreeMonthTrendChart />
          </div>
          <TopPerformersCard />
        </div>

        {/* Row 2 - Pie Charts: Lab/Rad, Ref/NonRef, Payment Mode, Volume */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <LabRadSplitChart />
          <RefNonRefPieChart />
          <PaymentModeChart />
          <VolumeSummaryChart />
        </div>

        {/* Row 3 - Branch Revenue Stacked Bar */}
        <BranchRevenueChart />

        {/* Row 4 - Heat Map */}
        <DepartmentHeatMap />

        {/* Bottom KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            title="Avg Per Patient"
            value="₹2,475"
            change="+8.3%"
            changeType="positive"
            icon={Activity}
            drilldownUrl="/avg-realisation"
          />
          <KPICard
            title="Referral Rate"
            value="67%"
            change="+2.1%"
            changeType="positive"
            icon={ArrowUpRight}
            drilldownUrl="/ref-nonref"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
