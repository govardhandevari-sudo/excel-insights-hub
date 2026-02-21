import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { DataTable } from "@/components/reports/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { formatLakhs } from "@/utils/currency";
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
  { key: "cash", label: "Cash", align: "right", render: v => formatLakhs(v) },
  { key: "upi", label: "UPI", align: "right", render: v => formatLakhs(v) },
  { key: "credit", label: "Credit", align: "right", render: v => formatLakhs(v) },
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

  const [activeSeries, setActiveSeries] = useState({
    Cash: true,
    UPI: true,
    Credit: true
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
      .then(res => {
        console.log(res.data)
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
  const pieDisplayData = pieData.map(item => ({
    ...item,
    value: activeSeries[item.name] ? item.value : 0
  }));
  const stackedChartData = chartData.map(b => ({
    name: (b.branch || "").substring(0, 20),
    Cash: Number(b.cash || 0),
    UPI: Number(b.upi || 0),
    Credit: Number(b.credit || 0)
  }));

  const categoryGap =
    stackedChartData.length > 40
      ? "2%"
      : stackedChartData.length > 20
        ? "8%"
        : "20%";
  const count = stackedChartData.length || 1;

  /**
   * Width per category:
   *  - <=20  → spacious
   *  - <=50  → medium
   *  - <=100 → dense
   *  - >100  → ultra dense
   */
  const categoryWidth =
    count <= 20
      ? 45
      : count <= 50
        ? 30
        : count <= 100
          ? 18
          : 12;

  const dynamicWidth = count * categoryWidth;

  /**
   * Bar thickness
   */
  const barSize =
    count <= 20
      ? 24
      : count <= 50
        ? 16
        : count <= 100
          ? 10
          : 6;


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
            <KPICard title="Cash" value={formatLakhs(summary.cash.amount)} change={`${summary.cash.percentage}%`} icon={Banknote} />
            <KPICard title="UPI" value={formatLakhs(summary.upi.amount)} change={`${summary.upi.percentage}%`} icon={Smartphone} />
            <KPICard title="Credit" value={formatLakhs(summary.credit.amount)} change={`${summary.credit.percentage}%`} icon={Wallet} />
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
                    data={pieDisplayData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    isAnimationActive
                    animationDuration={800}
                  >
                    {pieDisplayData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        fillOpacity={activeSeries[entry.name] ? 1 : 0.3}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(v, name) => [formatLakhs(v), name]}
                  />

                  <Legend
                    payload={pieData.map(item => ({
                      value: item.name,
                      type: "square",
                      id: item.name,
                      color: item.color
                    }))}

                    onClick={(e) => {
                      const key = e.value;

                      setActiveSeries(prev => {
                        const activeCount = Object.values(prev).filter(Boolean).length;

                        if (prev[key] && activeCount === 1) {
                          return prev; // prevent hiding last slice
                        }

                        return {
                          ...prev,
                          [key]: !prev[key]
                        };
                      });
                    }}

                    formatter={(value) => (
                      <span
                        style={{
                          opacity: activeSeries[value] ? 1 : 0.4,
                          textDecoration: activeSeries[value] ? "none" : "line-through",
                          cursor: "pointer"
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />

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
                  minWidth: `${Math.max(dynamicWidth, 800)}px`
                }}
                className="h-full"
              >

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stackedChartData}
                    barCategoryGap={0}
                    barGap={0}
                    margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
                  >


                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={count > 50 ? -90 : -30}
                      textAnchor="end"
                      height={count > 50 ? 120 : 60}
                      tick={{ fontSize: count > 80 ? 9 : 11 }}
                    />


                    <YAxis
                      tickFormatter={(v) => formatLakhs(v)}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip
                      formatter={(v) => formatLakhs(v)}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb"
                      }}
                    />

                    <Legend
                      onClick={(e) => {
                        const key = e.dataKey || e.value;

                        setActiveSeries(prev => {
                          const currentlyActive = Object.values(prev).filter(Boolean).length;

                          // Prevent disabling last active item
                          if (prev[key] && currentlyActive === 1) {
                            return prev;
                          }

                          return {
                            ...prev,
                            [key]: !prev[key]
                          };
                        });
                      }}

                      formatter={(value) => (
                        <span
                          style={{
                            opacity: activeSeries[value] ? 1 : 0.4,
                            textDecoration: activeSeries[value] ? "none" : "line-through",
                            cursor: "pointer"
                          }}
                        >
                          {value}
                        </span>
                      )}
                    />

                    <Bar
                      dataKey="Cash"
                      stackId="a"
                      barSize={barSize}
                      fill="hsl(var(--chart-3))"
                      hide={!activeSeries.Cash}
                      isAnimationActive={count <= 60}
                      animationDuration={400}
                    />

                    <Bar
                      dataKey="UPI"
                      stackId="a"
                      barSize={barSize}
                      fill="hsl(var(--chart-2))"
                      hide={!activeSeries.UPI}
                      isAnimationActive={count <= 60}
                      animationDuration={400}
                    />

                    <Bar
                      dataKey="Credit"
                      stackId="a"
                      barSize={barSize}
                      fill="hsl(var(--chart-1))"
                      hide={!activeSeries.Credit}
                      isAnimationActive={count <= 60}
                      animationDuration={400}
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
