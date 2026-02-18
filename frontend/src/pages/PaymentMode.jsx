import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, Banknote, Smartphone } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { api } from "@/services/api";

/* ===================== DATE UTILS ===================== */
const formatDDMMYYYY = (value) => {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB").replaceAll("/", "-");
};

const getDefault3MonthRange = () => {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);
  return { from, to };
};

/* ===================== TABLE COLUMNS (UNCHANGED) ===================== */
const columns = [
  { key: "branch", label: "Branch", align: "left" },
  { key: "cash", label: "Cash (₹L)", align: "right", render: v => `₹${v.toFixed(1)}L` },
  { key: "upi", label: "UPI (₹L)", align: "right", render: v => `₹${v.toFixed(1)}L` },
  { key: "credit", label: "Credit (₹L)", align: "right", render: v => `₹${v.toFixed(1)}L` },
  {
    key: "total",
    label: "Total",
    align: "right",
    render: v => <span className="font-semibold">₹{v.toFixed(1)}L</span>
  }
];

const PaymentMode = () => {
  /* ===================== FILTER STATE ===================== */
  const { from, to } = getDefault3MonthRange();

  const [filters, setFilters] = useState({
    stateid: "",
    cityid: "",
    centreid: "",
    fromDate: from,
    toDate: to
  });

  /* ===================== MASTER DATA ===================== */
  const [masters, setMasters] = useState({
    states: [],
    cities: [],
    centres: []
  });

  /* ===================== DATA STATES ===================== */
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState({ branches: [] });

  const [tableState] = useState({
    page: 1,
    perPage: 10
  });

  const [tableRows, setTableRows] = useState([]);

  /* ===================== LOAD FILTER MASTERS ===================== */
  useEffect(() => {
    api.get("/payments/filters", {
      params: {
        stateid: filters.stateid || undefined,
        cityid: filters.cityid || undefined
      }
    }).then(res => { 
      setMasters({
        states: res.data.data.states || [],
        cities: res.data.data.cities || [],
        centres: res.data.data.centres || []
      });
    });
  }, [filters.stateid, filters.cityid]);

  /* ===================== NORMALIZED API PARAMS ===================== */
  const apiParams = useMemo(() => {
    if (!filters.fromDate || !filters.toDate) return null;

    return {
      stateid: filters.stateid || undefined,
      cityid: filters.cityid || undefined,
      centreid: filters.centreid || undefined,
      fromDate: formatDDMMYYYY(filters.fromDate),
      toDate: formatDDMMYYYY(filters.toDate)
    };
  }, [
    filters.stateid,
    filters.cityid,
    filters.centreid,
    filters.fromDate,
    filters.toDate
  ]);

  /* ===================== MAIN DATA LOAD (ONE PLACE) ===================== */
  useEffect(() => {
    if (!apiParams) return;

    /* ---- SUMMARY ---- */
    api.get("/payments/summary", { params: apiParams })
      .then(res => {
        const s = res.data.data || {}; console.log("resdata ",s); 
        setSummary({
          cash: s.cash || { amount: 0, percentage: 0 },
          upi: s.upi || { amount: 0, percentage: 0 },
          credit: s.credit || { amount: 0, percentage: 0 },
          digitalAdoption: s.digitalAdoption || { percentage: 0 }
        });
      });

    /* ---- CHARTS ---- */
    api.get("/payments/branch-distribution", { params: apiParams })
      .then(res => {
        setChartData({
          branches: Array.isArray(res.data?.branches)
            ? res.data.branches
            : []
        });
      });

    /* ---- TABLE ---- */
    api.get("/payments/branch-table", {
      params: {
        ...apiParams,
        page: tableState.page,
        perPage: tableState.perPage
      }
    }).then(res => {
      setTableRows(Array.isArray(res.data?.data) ? res.data.data : []);
    });

  }, [apiParams, tableState.page, tableState.perPage]);

  /* ===================== DERIVED UI DATA ===================== */
  const pieData = summary ? [
    { name: "Cash", value: summary.cash.amount, color: "hsl(var(--chart-3))" },
    { name: "UPI", value: summary.upi.amount, color: "hsl(var(--chart-2))" },
    { name: "Credit", value: summary.credit.amount, color: "hsl(var(--chart-1))" }
  ] : [];

  const stackedChartData = chartData.branches.map(b => ({
    name: (b.centre || "").substring(0, 6),
    Cash: b.cash || 0,
    UPI: b.upi || 0,
    Credit: b.credit || 0
  }));

  /* ===================== RENDER ===================== */
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Payment Mode Report"
          description="Cash / UPI / Credit breakdown – Branch-wise"
          icon={CreditCard}
        />

       <ReportFilters
  dropdowns={[
    {
      key: "stateid",
      label: "State",
      options: masters.states,
      optionValue: "id",
      optionLabel: "state"
    },
    {
      key: "cityid",
      label: "City",
      options: masters.cities,
      optionValue: "id",
      optionLabel: "city"
    },
    {
      key: "centreid",
      label: "Branch",
      options: masters.centres,
      optionValue: "centreid",
      optionLabel: "centre"
    }
  ]}
  showDateRange
  filters={filters}
  onFilterChange={(key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };

      if (key === "stateid") {
        next.cityid = "";
        next.centreid = "";
      }
      if (key === "cityid") {
        next.centreid = "";
      }

      return next;
    });
  }}
/>


        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Cash" value={`₹${summary.cash.amount}L`} change={`${summary.cash.percentage}%`} icon={Banknote} />
            <KPICard title="UPI" value={`₹${summary.upi.amount}L`} change={`${summary.upi.percentage}%`} icon={Smartphone} />
            <KPICard title="Credit" value={`₹${summary.credit.amount}L`} change={`${summary.credit.percentage}%`} icon={Wallet} />
            <KPICard title="Digital Adoption" value={`${summary.digitalAdoption.percentage}%`} icon={CreditCard} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Payment Distribution</CardTitle></CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={90}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `₹${v}L`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Branch-wise Payment Mix</CardTitle></CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer>
                <BarChart data={stackedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={v => `₹${v}L`} />
                  <Tooltip formatter={v => `₹${v}L`} />
                  <Legend />
                  <Bar dataKey="Cash" stackId="a" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="UPI" stackId="a" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="Credit" stackId="a" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title="Branch-wise Payment Mode Breakdown"
          subtitle="All amounts in Lakhs"
          columns={columns}
          data={tableRows}
        />
      </div>
    </DashboardLayout>
  );
};

export default PaymentMode;
