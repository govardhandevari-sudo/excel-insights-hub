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
import { Button } from "@/components/ui/button";

import { api } from "@/services/api";

/* ===================== DEFAULT DATE ===================== */
const getDefault3MonthRange = () => {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);
  return { from, to };
};

/* ===================== TABLE COLUMNS ===================== */
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

  const { from, to } = getDefault3MonthRange();

  /* ===================== FILTER STATE ===================== */
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

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalRecords: 0,
    totalPages: 1
  });

  /* ===================== DATA STATES ===================== */
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [tableState] = useState({
    page: 1,
    perPage: 10
  });

  /* ===================== LOAD FILTER OPTIONS ===================== */
  useEffect(() => {
    api.get("/payments/filters", {
      params: {
        stateid: filters.stateid || undefined,
        cityid: filters.cityid || undefined
      }
    }).then(res => { 
      const f = res.data.data?.filters || {};

      setMasters({
        states: f.states || [],
        cities: f.cities || [],
        centres: f.centres || []
      });
    });
  }, [filters.stateid, filters.cityid]);

  /* ===================== API PARAM NORMALIZATION ===================== */
  const apiParams = useMemo(() => {
    if (!filters.fromDate || !filters.toDate) return null;

    return {
      stateid: filters.stateid || undefined,
      cityid: filters.cityid || undefined,
      centreid: filters.centreid || undefined,
      fromDate: filters.fromDate,
      toDate: filters.toDate
    };
  }, [filters]);

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    if (!apiParams) return;

    /* SUMMARY */
    api.get("/payments/summary", { params: apiParams })
      .then(res => { console.log(res.data)
        const s = res.data.data?.summary || {};

        setSummary({
          cash: s.cash || { amount: 0, percentage: 0 },
          upi: s.upi || { amount: 0, percentage: 0 },
          credit: s.credit || { amount: 0, percentage: 0 },
          digitalAdoption: s.digitalAdoption || { percentage: 0 }
        });
      });

    /* CHART */
    api.get("/payments/branch-distribution", { params: apiParams })
      .then(res => {
        const rows = res.data.data?.rows || [];
        setChartData(rows);
      });

   api.get("/payments/branch-table", {
      params: {
        ...apiParams,
        page: pagination.page,
        perPage: pagination.perPage
      }
    }).then(res => {

      const rows = res.data?.data?.rows || [];
      const pg = res.data?.data?.pagination || {};

      setTableRows(rows);

      setPagination(prev => ({
        ...prev,
        page: pg.page || 1,
        perPage: pg.perPage || 10,
        totalRecords: pg.totalRecords || 0,
        totalPages: pg.totalPages || 1
      }));
    });


  }, [apiParams, pagination.page, pagination.perPage]);

  const handleExport = async () => {
  const response = await api.get(
    "/payments/branch-table/export-xlsx",
    {
      params: {
        ...apiParams,
        search: "",
        sortBy: "",
        sortOrder: ""
      },
      responseType: "blob"
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;

  link.setAttribute(
    "download",
    `payment_report_${apiParams.fromDate}_to_${apiParams.toDate}.xlsx`
  );

  document.body.appendChild(link);
  link.click();
  link.remove();
};

  /* ===================== DERIVED DATA ===================== */

  const pieData = summary ? [
    { name: "Cash", value: summary.cash.amount, color: "hsl(var(--chart-3))" },
    { name: "UPI", value: summary.upi.amount, color: "hsl(var(--chart-2))" },
    { name: "Credit", value: summary.credit.amount, color: "hsl(var(--chart-1))" }
  ] : [];

  const stackedChartData = chartData.map(b => ({
    name: (b.branch || "").substring(0, 20),
    Cash: Number(b.cash || 0),
    UPI: Number(b.upi || 0),
    Credit: Number(b.credit || 0)
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

    <Pie
      data={pieData}
      dataKey="value"
      innerRadius={60}
      outerRadius={100}
      paddingAngle={3}
      isAnimationActive
      animationDuration={900}
      animationEasing="ease-out"
    >
      {pieData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={entry.color}
          stroke="white"
          strokeWidth={2}
        />
      ))}
    </Pie>

    <Tooltip
      formatter={(v, name) => [`₹${v}L`, name]}
      contentStyle={{
        borderRadius: 8,
        border: "1px solid #e5e7eb"
      }}
    />

    <Legend verticalAlign="bottom" height={36} />

  </PieChart>
</ResponsiveContainer>

            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
  <CardHeader>
    <CardTitle>Branch-wise Payment Mix</CardTitle>
  </CardHeader>

  <CardContent className="h-[350px] overflow-x-auto transition-all duration-500 ease-in-out">

    <div
      style={{
        minWidth: `${Math.max(stackedChartData.length * 80, 800)}px`
      }}
      className="h-full"
    >

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stackedChartData}
          margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
        >

          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          <XAxis
            dataKey="name"
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 11 }}
          />

          <YAxis
            tickFormatter={(v) => `₹${v}L`}
            tick={{ fontSize: 11 }}
          />

          <Tooltip
            formatter={(v) => `₹${v}L`}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb"
            }}
          />

          <Legend />

          <Bar
            dataKey="Cash"
            stackId="a"
            fill="hsl(var(--chart-3))"
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={800}
          />

          <Bar
            dataKey="UPI"
            stackId="a"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={900}
          />

          <Bar
            dataKey="Credit"
            stackId="a"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={1000}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  </CardContent>
</Card>


        </div>

       <DataTable
          title="Branch-wise Payment Mode Breakdown"
          subtitle="All amounts in Lakhs"
           columns={columns}
            data={tableRows}
            pagination={pagination}
            onPageChange={(page, perPage) => {
              setPagination(prev => ({
                ...prev,
                page: page ?? prev.page,
                perPage: perPage ?? prev.perPage
              }));
            }}
             extraActions={
                <Button onClick={handleExport}>
                  Download Excel
                </Button>
              }
        />

      </div>
    </DashboardLayout>
  );
};

export default PaymentMode;
