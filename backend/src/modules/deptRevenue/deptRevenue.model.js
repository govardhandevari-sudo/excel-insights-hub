const db = require('../common/base.repository');
const mysql = require('mysql2');
const { getLocationFilters } = require("../common/locationFilters.model");
const ExcelJS = require("exceljs");

const buildCommonWhere = ({ stateid, cityid, centreid, fromDate, toDate }) => {

  let where = `
    WHERE lt.IsCancel = 0
      AND plo.IsRefund = 0
      AND lt.Date >= ?
      AND lt.Date < DATE_ADD(?, INTERVAL 1 DAY)
  `;

  const values = [fromDate, toDate];

  if (centreid) {
    where += ` AND lt.CentreID = ?`;
    values.push(centreid);
  }

  if (stateid || cityid) {
    where += `
      AND lt.CentreID IN (
        SELECT CentreID
        FROM centre_master
        WHERE isActive = 1
        ${stateid ? "AND StateID = ?" : ""}
        ${cityid ? "AND CityID = ?" : ""}
      )
    `;
    if (stateid) values.push(stateid);
    if (cityid) values.push(cityid);
  }

  return { where, values };
};

/* ===================== SUMMARY ===================== */
exports.getDeptRevenueSummary_bak = async ({
  stateid,
  cityid,
  centreid,
  fromDate,
  toDate
}) => {

  /* ---------- PERIOD CALCULATION ---------- */
  const start = new Date(fromDate);
  const end = new Date(toDate);

  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - diffDays + 1);

  /* ---------- COMMON WHERE ---------- */
  let where = `
    WHERE lt.IsCancel = 0
      AND plo.IsRefund = 0
      AND lt.Date BETWEEN ? AND ?
  `;

  const values = [fromDate, toDate];

  if (centreid) {
    where += ` AND lt.CentreID = ?`;
    values.push(centreid);
  }

  if (stateid || cityid) {
    where += `
      AND lt.CentreID IN (
        SELECT CentreID
        FROM centre_master
        WHERE isActive = 1
        ${stateid ? "AND StateID = ?" : ""}
        ${cityid ? "AND CityID = ?" : ""}
      )
    `;

    if (stateid) values.push(stateid);
    if (cityid) values.push(cityid);
  }

  /* ---------- CURRENT PERIOD ---------- */
  const currentRes = await db.query(`
    SELECT SUM(plo.Amount) AS total
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    ${where}
  `, values);

  const currentRevenue = currentRes.length ? currentRes[0].total : 0;

  /* ---------- PREVIOUS PERIOD ---------- */
  const prevValues = [
    prevStart.toISOString().split("T")[0],
    prevEnd.toISOString().split("T")[0],
    ...values.slice(2)
  ];

  const prevRes = await db.query(`
    SELECT SUM(plo.Amount) AS total
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    ${where.replace("BETWEEN ? AND ?", "BETWEEN ? AND ?")}
  `, prevValues);

  const previousRevenue = prevRes.length ? prevRes[0].total : 0;

  const growthPercentage =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  /* ---------- TOP CATEGORY ---------- */
  const topCategoryRes = await db.query(`
    SELECT 
      sm.CategoryID AS category,
      SUM(plo.Amount) AS total
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sm
      ON sm.SubCategoryID = plo.SubCategoryID
    ${where}
    GROUP BY sm.CategoryID
    ORDER BY total DESC
    LIMIT 1
  `, values);
  
   const topCategory = topCategoryRes.length ? topCategoryRes[0] : null;



  /* ---------- TOP DEPARTMENT IN TOP CATEGORY ---------- */
  let topDepartment = {};

  if (topCategory && topCategory.category) {
    const [deptRes] = await db.query(`
      SELECT 
        sm.Name AS department,
        SUM(plo.Amount) AS total
      FROM patient_labinvestigation_opd plo
      JOIN f_ledgertransaction lt 
        ON lt.LedgerTransactionID = plo.LedgerTransactionID
      JOIN f_subcategorymaster sm
        ON sm.SubCategoryID = plo.SubCategoryID
      ${where}
      AND sm.CategoryID = ?
      GROUP BY sm.Name
      ORDER BY total DESC
      LIMIT 1
    `, [...values, topCategory.category]);

    topDepartment = deptRes.length ? deptRes[0] : {};
  }

  /* ---------- COUNTS ---------- */
  const countRes = await db.query(`
    SELECT 
      COUNT(DISTINCT sm.Name) AS departmentCount,
      COUNT(DISTINCT sm.CategoryID) AS categoryCount
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sm
      ON sm.SubCategoryID = plo.SubCategoryID
    ${where}
  `, values);

  /* ---------- TOP DEPARTMENT OVERALL ---------- */
const topDeptOverallRes = await db.query(`
  SELECT 
    sm.Name AS department,
    SUM(plo.Amount) AS total
  FROM patient_labinvestigation_opd plo
  JOIN f_ledgertransaction lt 
    ON lt.LedgerTransactionID = plo.LedgerTransactionID
  JOIN f_subcategorymaster sm
    ON sm.SubCategoryID = plo.SubCategoryID
  ${where}
  GROUP BY sm.Name
  ORDER BY total DESC
  LIMIT 1
`, values);

const topDeptOverall = topDeptOverallRes.length ? topDeptOverallRes[0] : {};

return {
  totalRevenue: currentRevenue / 100000,
  previousRevenue: previousRevenue / 100000,
  growthPercentage,

  topDepartmentOverall: {
    name: topDeptOverall?.department || "",
    revenue: (topDeptOverall?.total || 0) / 100000
  },

  topCategory: {
    name: topCategory?.category || "",
    revenue: (topCategory?.total || 0) / 100000
  },

  topDepartment: {
    name: topDepartment?.department || "",
    revenue: (topDepartment?.total || 0) / 100000
  },

  departmentCount: countRes?.[0]?.departmentCount || 0,
  categoryCount: countRes?.[0]?.categoryCount || 0
};


};

/* ===================== SUMMARY ===================== */
exports.getDeptRevenueSummary = async ({
  stateid,
  cityid,
  centreid,
  fromDate,
  toDate
}) => {

  /* ---------- PERIOD CALCULATION ---------- */
  const start = new Date(fromDate);
  const end = new Date(toDate);

  const diffDays =
    Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - diffDays + 1);

  /* ---------- COMMON WHERE ---------- */
  let where = `
    WHERE lt.IsCancel = 0
      AND plo.IsRefund = 0
      AND lt.Date BETWEEN ? AND ?
  `;

  const values = [fromDate, toDate];

  if (centreid) {
    where += ` AND lt.CentreID = ?`;
    values.push(centreid);
  }

  if (stateid || cityid) {
    where += `
      AND lt.CentreID IN (
        SELECT CentreID
        FROM centre_master
        WHERE isActive = 1
        ${stateid ? "AND StateID = ?" : ""}
        ${cityid ? "AND CityID = ?" : ""}
      )
    `;

    if (stateid) values.push(stateid);
    if (cityid) values.push(cityid);
  }

  /* ---------- CURRENT PERIOD ---------- */
  const currentRes = await db.query(`
    SELECT SUM(plo.Amount) AS total
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    ${where}
  `, values);

  const currentRevenue = currentRes?.[0]?.total || 0;

  /* ---------- PREVIOUS PERIOD ---------- */
  const prevValues = [
    prevStart.toISOString().split("T")[0],
    prevEnd.toISOString().split("T")[0],
    ...values.slice(2)
  ];

  const prevRes = await db.query(`
    SELECT SUM(plo.Amount) AS total
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    ${where}
  `, prevValues);

  const previousRevenue = prevRes?.[0]?.total || 0;

  const growthPercentage =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  /* ---------- TOP CATEGORY ---------- */
  const topCategoryRes = await db.query(`
    SELECT 
      sm.CategoryID AS category,
      SUM(plo.Amount) AS total
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sm
      ON sm.SubCategoryID = plo.SubCategoryID
    ${where}
    GROUP BY sm.CategoryID
    ORDER BY total DESC
    LIMIT 1
  `, values);

  const topCategory = topCategoryRes?.[0] || null;

  /* ---------- TOP DEPARTMENT IN TOP CATEGORY ---------- */
  let topDepartment = {};

  if (topCategory?.category) {

    const deptRes = await db.query(`
      SELECT 
        sm.Name AS department,
        SUM(plo.Amount) AS total
      FROM patient_labinvestigation_opd plo
      JOIN f_ledgertransaction lt 
        ON lt.LedgerTransactionID = plo.LedgerTransactionID
      JOIN f_subcategorymaster sm
        ON sm.SubCategoryID = plo.SubCategoryID
      ${where}
      AND sm.CategoryID = ?
      GROUP BY sm.Name
      ORDER BY total DESC
      LIMIT 1
    `, [...values, topCategory.category]);

    topDepartment = deptRes?.[0] || {};
  }

  /* ---------- TOP DEPARTMENT OVERALL ---------- */
  const topDeptOverallRes = await db.query(`
    SELECT 
      sm.Name AS department,
      SUM(plo.Amount) AS total
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sm
      ON sm.SubCategoryID = plo.SubCategoryID
    ${where}
    GROUP BY sm.Name
    ORDER BY total DESC
    LIMIT 1
  `, values);

  const topDeptOverall = topDeptOverallRes?.[0] || {};

  /* ---------- COUNTS ---------- */
  const countRes = await db.query(`
    SELECT 
      COUNT(DISTINCT sm.Name) AS departmentCount,
      COUNT(DISTINCT sm.CategoryID) AS categoryCount
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sm
      ON sm.SubCategoryID = plo.SubCategoryID
    ${where}
  `, values);

  /* ---------- RETURN ---------- */
  return {
    totalRevenue: currentRevenue / 100000,
    previousRevenue: previousRevenue / 100000,
    growthPercentage,

    topDepartmentOverall: {
      name: topDeptOverall.department || "",
      revenue: (topDeptOverall.total || 0) / 100000
    },

    topCategory: {
      name: topCategory?.category || "",
      revenue: (topCategory?.total || 0) / 100000
    },

    topDepartment: {
      name: topDepartment.department || "",
      revenue: (topDepartment.total || 0) / 100000
    },

    departmentCount: countRes?.[0]?.departmentCount || 0,
    categoryCount: countRes?.[0]?.categoryCount || 0
  };
};

exports.getCategorySplit = async (filters) => {

  const { where, values } = buildCommonWhere(filters);

  const rows = await db.query(`
    SELECT 
      sm.CategoryID AS category,
      SUM(plo.Amount) / 100000 AS revenue
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sm
      ON sm.SubCategoryID = plo.SubCategoryID
    ${where}
    GROUP BY sm.CategoryID
    ORDER BY revenue DESC
  `, values);

  return rows;
};
exports.getCategoryBreakdown = async (filters) => {

  const { where, values } = buildCommonWhere(filters);

  /* Find top category first */
  const topCat = await db.query(`
    SELECT sm.CategoryID AS category
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sm
      ON sm.SubCategoryID = plo.SubCategoryID
    ${where}
    GROUP BY sm.CategoryID
    ORDER BY SUM(plo.Amount) DESC
    LIMIT 1
  `, values);

  const category = topCat?.[0]?.category;
  if (!category) return [];

  const rows = await db.query(`
    SELECT 
      sm.Name AS department,
      SUM(plo.Amount) / 100000 AS revenue
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sm
      ON sm.SubCategoryID = plo.SubCategoryID
    ${where}
      AND sm.CategoryID = ?
    GROUP BY sm.Name
    ORDER BY revenue DESC
  `, [...values, category]);

  return rows;
};
exports.getTrendData = async (filters) => {

  const { fromDate, toDate } = filters;

  const start = new Date(fromDate);
  const end = new Date(toDate);

  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const segment = Math.floor(totalDays / 3);

  const d1 = new Date(start);
  const d2 = new Date(start); d2.setDate(d2.getDate() + segment);
  const d3 = new Date(d2);    d3.setDate(d3.getDate() + segment);

  const d4 = new Date(end);

  const { where, values } = buildCommonWhere(filters);

  const rows = await db.query(`
    SELECT
      sm.Name AS department,

      SUM(CASE 
          WHEN lt.Date >= ? AND lt.Date < ? 
          THEN plo.Amount ELSE 0 END) / 100000 AS segment1,

      SUM(CASE 
          WHEN lt.Date >= ? AND lt.Date < ? 
          THEN plo.Amount ELSE 0 END) / 100000 AS segment2,

      SUM(CASE 
          WHEN lt.Date >= ? AND lt.Date <= ? 
          THEN plo.Amount ELSE 0 END) / 100000 AS segment3

    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt 
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sm
      ON sm.SubCategoryID = plo.SubCategoryID

    ${where}

    GROUP BY sm.Name
    ORDER BY segment3 DESC
    LIMIT 5
  `, [
    d1, d2,
    d2, d3,
    d3, d4,
    ...values
  ]);

  return rows;
};

exports.getDeptRevenueTable = async ({
  stateid,
  cityid,
  centreid,
  fromDate,
  toDate,
  page = 1,
  perPage = 20,
  search = ""
}) => {

  page = Number(page);
  perPage = Number(perPage);
  const offset = (page - 1) * perPage;

  /* ================= WEEK & MONTH DERIVATION ================= */

  const to = new Date(toDate);

  /* ===== ISO WEEK FUNCTION ===== */
  const getISOWeek = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const currentWeek = getISOWeek(to);

  // Last 3 completed weeks
  const weeks = [
    currentWeek - 1,
    currentWeek - 2,
    currentWeek - 3
  ];

  /* ===== MONTH HEADERS ===== */

  const monthName = to.toLocaleString("default", { month: "short" });
  const yearShort = String(to.getFullYear()).slice(-2);

  const prevMonth = new Date(to);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  const prev2Month = new Date(to);
  prev2Month.setMonth(prev2Month.getMonth() - 2);

  const prevMonthName = prevMonth.toLocaleString("default", { month: "short" });
  const prevMonthYear = String(prevMonth.getFullYear()).slice(-2);

  const prev2MonthName = prev2Month.toLocaleString("default", { month: "short" });
  const prev2MonthYear = String(prev2Month.getFullYear()).slice(-2);

  const currentYear = to.getFullYear();
  const currentMonth = to.getMonth() + 1;

  /* ================= BASE FILTER ================= */

  let where = `
    WHERE lt.Date BETWEEN ? AND ?
      AND lt.IsCancel = 0
  `;

  const values = [fromDate, toDate];

  if (stateid) {
    where += ` AND cm.StateID = ?`;
    values.push(stateid);
  }

  if (cityid) {
    where += ` AND cm.CityID = ?`;
    values.push(cityid);
  }

  if (centreid) {
    where += ` AND lt.CentreID = ?`;
    values.push(centreid);
  }

  if (search) {
    where += ` AND (sc.Name LIKE ? OR sc.CategoryID LIKE ?)`;
    values.push(`%${search}%`, `%${search}%`);
  }

  /* ================= MAIN QUERY ================= */

  const mainQuery = `
    SELECT
      sc.CategoryID AS category,
      sc.Name AS department,

      SUM(CASE WHEN WEEK(lt.Date, 3) = ? THEN plo.Amount ELSE 0 END) / 100000 AS w0,
      SUM(CASE WHEN WEEK(lt.Date, 3) = ? THEN plo.Amount ELSE 0 END) / 100000 AS w1,
      SUM(CASE WHEN WEEK(lt.Date, 3) = ? THEN plo.Amount ELSE 0 END) / 100000 AS w2,

      SUM(CASE 
            WHEN YEAR(lt.Date) = ?
             AND MONTH(lt.Date) = ?
            THEN plo.Amount ELSE 0 
          END) / 100000 AS m0,

      SUM(CASE 
            WHEN YEAR(lt.Date) = YEAR(DATE_SUB(?, INTERVAL 1 MONTH))
             AND MONTH(lt.Date) = MONTH(DATE_SUB(?, INTERVAL 1 MONTH))
            THEN plo.Amount ELSE 0 
          END) / 100000 AS m1,

      SUM(CASE 
            WHEN YEAR(lt.Date) = YEAR(DATE_SUB(?, INTERVAL 2 MONTH))
             AND MONTH(lt.Date) = MONTH(DATE_SUB(?, INTERVAL 2 MONTH))
            THEN plo.Amount ELSE 0 
          END) / 100000 AS m2

    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sc
      ON sc.SubCategoryID = plo.SubCategoryID
    JOIN centre_master cm
      ON cm.CentreID = lt.CentreID

    ${where}

    GROUP BY sc.CategoryID, sc.Name
    ORDER BY sc.CategoryID, sc.Name
    LIMIT ? OFFSET ?
  `;

  const queryValues = [
    weeks[0], weeks[1], weeks[2],
    currentYear, currentMonth,
    toDate, toDate,
    toDate, toDate,
    ...values,
    perPage,
    offset
  ];

  const rows = await db.query(mainQuery, queryValues);

  /* ================= COUNT ================= */

  const countQuery = `
    SELECT COUNT(DISTINCT sc.SubCategoryID) AS total
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction lt
      ON lt.LedgerTransactionID = plo.LedgerTransactionID
    JOIN f_subcategorymaster sc
      ON sc.SubCategoryID = plo.SubCategoryID
    JOIN centre_master cm
      ON cm.CentreID = lt.CentreID
    ${where}
  `;

  const countResult = await db.query(countQuery, values);
  const totalRecords = countResult[0]?.total || 0;
  const totalPages = Math.ceil(totalRecords / perPage);

  return {
    headers: {
      weeks: weeks.map(w => `W${w}`),
      months: [
        `${monthName} MTD`,
        `${prevMonthName} '${prevMonthYear}`,
        `${prev2MonthName} '${prev2MonthYear}`
      ]
    },
    rows,
    pagination: {
      page,
      perPage,
      totalRecords,
      totalPages
    }
  };
};
