const { getLocationFilters } = require("../common/locationFilters.model");
const model = require("./deptRevenue.model");
const response = require("../common/response.util");

exports.getDeptRevenueFilters = async (req, res, next) => {
  try {
    const { stateid, cityid } = req.query;

    const filters = await getLocationFilters({ stateid, cityid });

    return response.success(res, { filters });
  } catch (err) {
    next(err);
  }
};
exports.getDeptRevenueSummary = async (req, res, next) => {
  try {
    const summary = await model.getDeptRevenueSummary(req.query);
    return response.success(res, { summary });
  } catch (err) {
    next(err);
  }
};
exports.getCategorySplit = async (req, res, next) => {
  try {
    const rows = await model.getCategorySplit(req.query);
    return response.success(res, { rows });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const rows = await model.getCategoryBreakdown(req.query);
    return response.success(res, { rows });
  } catch (err) {
    next(err);
  }
};

exports.getTrendData = async (req, res, next) => {
  try {
    const rows = await model.getTrendData(req.query);
    return response.success(res, { rows });
  } catch (err) {
    next(err);
  }
};
exports.getDeptRevenueTable = async (req, res, next = () => {}) => {
  try {
    const result = await model.getDeptRevenueTable(req.query);
    return response.success(res, result);
  } catch (err) {
    next(err);
  }
};
exports.exportDeptRevenueTable_bak = async (req, res, next) => {
  try {

    const data = await model.getDeptRevenueTable(req.query);

    const rows = data.rows || [];
    const headers = data.headers || {};

    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dept Revenue");

    const columns = [
      { header: "Department", key: "department", width: 30 },
      ...headers.weeks.map((w, i) => ({
        header: w,
        key: `w${i}`,
        width: 15
      })),
      ...headers.months.map((m, i) => ({
        header: m,
        key: `m${i}`,
        width: 15
      }))
    ];

    worksheet.columns = columns;

    rows.forEach(row => {
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=dept_revenue.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    next(err);
  }
};
exports.exportDeptRevenueTable = async (req, res, next) => {
  try {

    const data = await model.getDeptRevenueTable(req.query);

    const rows = data.rows || [];
    const headers = data.headers || {};
    const { fromDate, toDate } = req.query;

    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dept Revenue");

    /* ================= TITLE ================= */

    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "Department Wise Revenue Report";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    worksheet.mergeCells("A2:F2");
    worksheet.getCell("A2").value = `Date Range: ${fromDate} to ${toDate}`;
    worksheet.getCell("A2").alignment = { horizontal: "center" };

    worksheet.addRow([]);

    /* ================= HEADERS ================= */

    const columnHeaders = [
      "Department",
      ...headers.weeks,
      ...headers.months
    ];

    const headerRow = worksheet.addRow(columnHeaders);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    headerRow.eachCell(cell => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
    });

    /* ================= DATA ================= */

    let grandTotals = new Array(columnHeaders.length).fill(0);

    rows.forEach(row => {

      const dataRow = [
        row.department,
        row.w0 || 0,
        row.w1 || 0,
        row.w2 || 0,
        row.m0 || 0,
        row.m1 || 0,
        row.m2 || 0
      ];

      const excelRow = worksheet.addRow(dataRow);

      excelRow.eachCell((cell, colNumber) => {
        if (colNumber > 1) {
          cell.numFmt = '"₹"#,##0.0"L"';
          cell.alignment = { horizontal: "right" };
          grandTotals[colNumber - 1] += Number(cell.value);
        } else {
          cell.alignment = { horizontal: "left" };
        }

        cell.border = {
          left: { style: "thin" },
          right: { style: "thin" }
        };
      });
    });

    /* ================= TOTAL ROW ================= */

    const totalRow = worksheet.addRow([
      "Grand Total",
      ...grandTotals.slice(1)
    ]);

    totalRow.font = { bold: true };

    totalRow.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        cell.numFmt = '"₹"#,##0.0"L"';
        cell.alignment = { horizontal: "right" };
      } else {
        cell.alignment = { horizontal: "left" };
      }

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" }
      };
    });

    /* ================= COLUMN WIDTH ================= */

    worksheet.columns.forEach(column => {
      column.width = 18;
    });

    worksheet.getColumn(1).width = 28;

    /* ================= FREEZE HEADER ================= */

    worksheet.views = [{ state: "frozen", ySplit: 4 }];

    /* ================= RESPONSE ================= */

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=dept_revenue.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    next(err);
  }
};

