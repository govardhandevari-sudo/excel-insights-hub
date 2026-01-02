import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { BranchRevenueChart } from "@/components/dashboard/BranchRevenueChart";
import { LabRadSplitChart } from "@/components/dashboard/LabRadSplitChart";
import { RevenueTrendChart } from "@/components/dashboard/RevenueTrendChart";
import { TopPerformersCard } from "@/components/dashboard/TopPerformersCard";
import { PaymentModeChart } from "@/components/dashboard/PaymentModeChart";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Building2, 
  Activity,
  ArrowUpRight,
  Calendar
} from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              MegSan Diagnostics - December 2025 Performance Overview
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
            <Calendar className="h-4 w-4" />
            <span>Last updated: Dec 29, 2025</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="MTD Revenue"
            value="₹21.12L"
            change="+12.5%"
            changeType="positive"
            icon={TrendingUp}
            subtitle="vs last month"
          />
          <KPICard
            title="MTD Target"
            value="₹25.00L"
            change="84.5% achieved"
            changeType="neutral"
            icon={Target}
          />
          <KPICard
            title="Total Patients"
            value="8,542"
            change="+5.2%"
            changeType="positive"
            icon={Users}
            subtitle="this month"
          />
          <KPICard
            title="Active Branches"
            value="12"
            change="3 states"
            changeType="neutral"
            icon={Building2}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RevenueTrendChart />
          </div>
          <LabRadSplitChart />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <BranchRevenueChart />
          </div>
          <TopPerformersCard />
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PaymentModeChart />
          <div className="grid grid-cols-2 gap-4">
            <KPICard
              title="Avg Per Patient"
              value="₹2,475"
              change="+8.3%"
              changeType="positive"
              icon={Activity}
            />
            <KPICard
              title="Referral Rate"
              value="67%"
              change="+2.1%"
              changeType="positive"
              icon={ArrowUpRight}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
