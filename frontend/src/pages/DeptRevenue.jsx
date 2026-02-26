// FULLY ALIGNED VERSION – MATCHES SCREENSHOT DESIGN

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Activity, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/reports/DataTable";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from "recharts";
import { api } from "@/services/api";

/* ================= DEFAULT DATE ================= */
const getDefault3MonthRange = () => {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);
  return { from, to };
};

const DeptRevenue = () => {

  const { from, to } = getDefault3MonthRange();

  const [filters, setFilters] = useState({
    stateid: "",
    cityid: "",
    centreid: "",
    fromDate: from,
    toDate: to
  });

  const [masters, setMasters] = useState({
    states: [],
    cities: [],
    centres: []
  });

  const [summary, setSummary] = useState(null);
  const [categorySplit, setCategorySplit] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [trend, setTrend] = useState([]);

  /* ================= TABLE STATE ================= */

  const [headers, setHeaders] = useState({ weeks: [], months: [] });
  const [tableRows, setTableRows] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    totalRecords: 0,
    totalPages: 1
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FILTER LOAD ================= */
  useEffect(() => {
    api.get("/dept-revenue/filters", {
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

  /* ================= PARAMS ================= */
  const apiParams = useMemo(() => {
    if (!filters.fromDate || !filters.toDate) return null;

    return {
      stateid: filters.stateid || undefined,
      cityid: filters.cityid || undefined,
      centreid: filters.centreid || undefined,
      fromDate: filters.fromDate.toISOString().split("T")[0],
      toDate: filters.toDate.toISOString().split("T")[0]
    };
  }, [filters.stateid, filters.cityid, filters.centreid, filters.fromDate, filters.toDate]);

  /* ================= DATA LOAD ================= */
  useEffect(() => {
    if (!apiParams) return;

    api.get("/dept-revenue/summary", { params: apiParams })
      .then(res => setSummary(res.data.data?.summary || null));

    api.get("/dept-revenue/category-split", { params: apiParams })
      .then(res => setCategorySplit(res.data.data?.rows || []));

    api.get("/dept-revenue/category-breakdown", { params: apiParams })
      .then(res => setBreakdown(res.data.data?.rows || []));

    api.get("/dept-revenue/trend", { params: apiParams })
      .then(res => setTrend(res.data.data?.rows || []));

  }, [apiParams]);
  /* ================= TABLE LOAD ================= */
useEffect(() => {
  if (!apiParams) return;

  setLoading(true);

  api.get("/dept-revenue/table", {
    params: {
      ...apiParams,
      page: pagination.page,
      perPage: pagination.perPage,
      search
    }
  }).then(res => {
    const data = res.data?.data || {};

    setHeaders(data.headers || { weeks: [], months: [] });
    setTableRows(data.rows || []);

    const pg = data.pagination || {};

    setPagination(prev => ({
      ...prev,
      page: pg.page || 1,
      perPage: pg.perPage || 20,
      totalRecords: pg.totalRecords || 0,
      totalPages: pg.totalPages || 1
    }));

    setLoading(false);
  });

}, [apiParams, pagination.page, pagination.perPage, search]);

  /* ================= CHART DATA ================= */

  const pieData = categorySplit.map((c, i) => ({
    name: c.category,
    value: Number(c.revenue || 0),
    color: `hsl(var(--chart-${(i % 5) + 1}))`
  }));

  const breakdownData = breakdown.map(d => ({
    name: d.department,
    value: Number(d.revenue || 0)
  }));

  const trendData = trend.map(d => ({
    name: d.department?.substring(0, 8),
    Segment1: Number(d.segment1 || 0),
    Segment2: Number(d.segment2 || 0),
    Segment3: Number(d.segment3 || 0)
  }));
/* ================= TABLE COLUMNS ================= */
const columns = useMemo(() => {

  const weekCols = headers.weeks.map((w, i) => ({
    key: `w${i}`,
    label: w,
    align: "right",
    render: v => v ? `₹${Number(v).toFixed(1)}L` : "-"
  }));

  const monthCols = headers.months.map((m, i) => ({
    key: `m${i}`,
    label: m,
    align: "right",
    render: v => v ? `₹${Number(v).toFixed(1)}L` : "-"
  }));

  return [
    {
      key: "department",
      label: "Department",
      align: "left",
      render: (v, row) =>
        row.isHeader
          ? <span className="font-semibold text-primary">{row.category}</span>
          : v
    },
    ...weekCols,
    ...monthCols
  ];

}, [headers]);

/* ================= GROUPED ROWS ================= */
const groupedRows = useMemo(() => {
  const result = [];
  let lastCategory = null;

  tableRows.forEach(row => {
    if (row.category !== lastCategory) {
      result.push({ isHeader: true, category: row.category });
      lastCategory = row.category;
    }
    result.push(row);
  });

  return result;
}, [tableRows]);

const handleExport = async () => {
  const response = await api.get(
    "/dept-revenue/table/export-xlsx",
    { params: { ...apiParams, search }, responseType: "blob" }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "dept_revenue.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        <PageHeader
          title="Department Wise Revenue"
          description="Revenue split with modality breakdown"
          icon={Building2}
        />

        <ReportFilters
          dropdowns={[
            { key: "stateid", label: "State", options: masters.states, optionValue: "id", optionLabel: "state" },
            { key: "cityid", label: "City", options: masters.cities, optionValue: "id", optionLabel: "city" },
            { key: "centreid", label: "Centre", options: masters.centres, optionValue: "centreid", optionLabel: "centre" }
          ]}
          showDateRange
          filters={filters}
          onFilterChange={(key, value) => {
            setFilters(prev => {
              const next = { ...prev, [key]: value };
              if (key === "stateid") { next.cityid = ""; next.centreid = ""; }
              if (key === "cityid") { next.centreid = ""; }
              return next;
            });
          }}
        />

        {/* ================= KPI ================= */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


          <KPICard
            title="Total MTD Revenue"
            value={`₹${summary?.totalRevenue?.toFixed(1) || 0}L`}
            change={`${summary?.growthPercentage?.toFixed(1) || 0}% vs previous`}
            changeType={summary?.growthPercentage >= 0 ? "positive" : "negative"}
            icon={TrendingUp}
          />

          <KPICard
            title="Top Department"
            value={summary?.topDepartmentOverall?.name || "-"}
            change={`₹${summary?.topDepartmentOverall?.revenue?.toFixed(1) || 0}L`}
            changeType="positive"
            icon={Activity}
          />

          <KPICard
            title={`Top ${summary?.topCategory?.name || "Category"}`}
            value={summary?.topDepartment?.name || "-"}
            change={`₹${summary?.topDepartment?.revenue?.toFixed(1) || 0}L`}
            changeType="positive"
            icon={Building2}
          />

          <KPICard
            title="Departments"
            value={summary?.departmentCount || 0}
            change={`Across ${summary?.categoryCount || 0} categories`}
            changeType="neutral"
            icon={Layers}
          />
        </div>

        {/* ================= CHART ROW ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2">

          {/* DONUT */}
         <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Department-wise Revenue Split
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[360px] flex items-center justify-center">
            <ResponsiveContainer width="90%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={90}
                  outerRadius={140}
                  paddingAngle={3}
                  stroke="none"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `₹${v.toFixed(1)}L`}
                  contentStyle={{ borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


          {/* BREAKDOWN */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Category → Modality Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] sm:h-[320px] lg:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={breakdownData}
                  layout="vertical"
                  margin={{ top: 10, right: 40, left: 60, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />

                  <XAxis
                    type="number"
                    tickFormatter={(v) => `₹${v}L`}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
  type="category"
  dataKey="name"
  width={80}
  tick={{ fontSize: 11 }}
/>

                  <Tooltip
                    formatter={(v) => `₹${v.toFixed(1)}L`}
                    contentStyle={{ borderRadius: "8px" }}
                  />

                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[0, 6, 6, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>

        {/* ================= TREND ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Top Departments - Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tickFormatter={(v) => `₹${v}L`}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(v) => `₹${v.toFixed(1)}L`}
                  contentStyle={{ borderRadius: "8px" }}
                />

                <Legend wrapperStyle={{ fontSize: "12px" }} />

                <Area
                  type="monotone"
                  dataKey="Segment1"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />

                <Area
                  type="monotone"
                  dataKey="Segment2"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />

                <Area
                  type="monotone"
                  dataKey="Segment3"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

{/* ================= TABLE ================= */}
<Card>
  <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
    <CardTitle className="text-base font-semibold">
      Complete Department Revenue Summary
    </CardTitle>

    <div className="flex flex-wrap gap-2">
      <input
        type="text"
        placeholder="Search department..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setPagination(p => ({ ...p, page: 1 }));
            setSearch(searchInput);
          }
        }}
        className="border rounded px-2 py-1 text-sm"
      />

      <Button
        size="sm"
        onClick={() => {
          setPagination(p => ({ ...p, page: 1 }));
          setSearch(searchInput);
        }}
      >
        Search
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setSearch("");
          setSearchInput("");
          setPagination(p => ({ ...p, page: 1 }));
        }}
      >
        Clear
      </Button>

      <Button size="sm" onClick={handleExport}>
        Export
      </Button>
    </div>
  </CardHeader>

  <CardContent className="overflow-x-auto">
    <DataTable
      columns={columns}
      data={groupedRows}
      loading={loading}
      pagination={pagination}
      onPageChange={(page) =>
        setPagination(prev => ({ ...prev, page }))
      }
      onPerPageChange={(perPage) =>
        setPagination(prev => ({ ...prev, perPage }))
      }
    />
  </CardContent>
</Card>

      </div>
    </DashboardLayout>
  );
};

export default DeptRevenue;
