const ExcelJS = require('exceljs');
const response = require('../common/response.util');
const { getPagination } = require('../common/pagination.util');
const { getSort } = require('../common/sort.util');
const model = require('./payments.model');

/* =========================================================
   FILTERS
========================================================= */

exports.getPaymentFilters = async (req, res, next) => {
  try {
    const { stateid, cityid } = req.query;

    const filters = await model.getPaymentFilters({ stateid, cityid });

    return response.success(res, {
      filters
    });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   SUMMARY
========================================================= */

exports.getPaymentSummary = async (req, res, next) => {
  try {
    const { fromDate, toDate, stateid, cityid, centreid } = req.query;

    if (!fromDate || !toDate) {
      return response.error(res, 'fromDate and toDate are required', 400);
    }

    const rows = await model.getPaymentSummaryByMode({
      fromDate,
      toDate,
      stateid,
      cityid,
      centreid
    });

    let credit = 0, cash = 0, digital = 0;

    rows.forEach(r => {
      const mode = (r.paymentmode || '').toLowerCase();
      const amt = Number(r.amount || 0);

      if (mode === 'cash') cash += amt;
      else if (mode === 'credit') credit += amt;
      else digital += amt;
    });

    const total = credit + cash + digital;
    const pct = v => total ? Math.round((v / total) * 100) : 0;

    const summary = {
      credit: { amount: credit, percentage: pct(credit) },
      upi: { amount: digital, percentage: pct(digital) },
      cash: { amount: cash, percentage: pct(cash) },
      digitalAdoption: { percentage: pct(digital) }
    };

    return response.success(res, { summary });

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   BRANCH DISTRIBUTION (For Chart)
========================================================= */

exports.getBranchDistribution = async (req, res, next) => {
  try {
    const { fromDate, toDate, stateid, cityid, centreid } = req.query;

    if (!fromDate || !toDate) {
      return response.error(res, 'fromDate and toDate are required', 400);
    }

    const rows = await model.getBranchPaymentDistribution({
      fromDate,
      toDate,
      stateid,
      cityid,
      centreid
    });

    const branchesMap = {};

    rows.forEach(r => {
      if (!branchesMap[r.centreid]) {
        branchesMap[r.centreid] = {
          centreid: r.centreid,
          branch: r.centre,
          credit: 0,
          upi: 0,
          cash: 0
        };
      }

      const mode = (r.paymentmode || '').toLowerCase();
      const amt = Number(r.amount || 0);

      if (mode === 'cash') branchesMap[r.centreid].cash += amt;
      else if (mode === 'credit') branchesMap[r.centreid].credit += amt;
      else branchesMap[r.centreid].upi += amt;
    });

    return response.success(res, {
      rows: Object.values(branchesMap)
    });

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   BRANCH TABLE (Paginated)
========================================================= */

exports.getBranchPaymentTable = async (req, res, next) => {
  try {
    const {
      fromDate, toDate,
      stateid, cityid, centreid, search
    } = req.query;

    const { page, limit, offset } = getPagination(req.query);
    const { sortBy, sortOrder } = getSort(req.query, ['centre','credit','upi','cash','total']);

    const rows = await model.getBranchPaymentTable({
      fromDate, toDate,
      stateid, cityid, centreid, search,
      sortBy, sortOrder,
      limit, offset
    });

    const totalRecords = await model.countBranchPaymentTable({
      fromDate, toDate,
      stateid, cityid, centreid, search
    });

    const formattedRows = rows.map(r => {
      const total = Number(r.total || 0);
      const pct = v => total ? Math.round((v / total) * 100) : 0;

      return {
        centreid: r.centreid,
        branch: r.branch,
        credit: Number(r.credit || 0),
        creditPct: pct(Number(r.credit || 0)),
        upi: Number(r.upi || 0),
        upiPct: pct(Number(r.upi || 0)),
        cash: Number(r.cash || 0),
        cashPct: pct(Number(r.cash || 0)),
        total
      };
    });

    return response.success(res, {
      rows: formattedRows,
      pagination: {
        page,
        perPage: limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit)
      }
    });

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   EXPORT CSV
========================================================= */

exports.exportBranchPaymentTable = async (req, res, next) => {
  try {
    const {
      fromDate, toDate,
      stateid, cityid, centreid, search,
      sortBy, sortOrder
    } = req.query;

    const rows = await model.exportBranchPaymentTable({
      fromDate, toDate,
      stateid, cityid, centreid, search,
      sortBy, sortOrder
    });

    let totalCredit = 0, totalUpi = 0, totalCash = 0, grandTotal = 0;

    rows.forEach(r => {
      totalCredit += Number(r.credit || 0);
      totalUpi += Number(r.upi || 0);
      totalCash += Number(r.cash || 0);
      grandTotal += Number(r.total || 0);
    });

    let csv = '';
    csv += 'Payment Branch Summary\n';
    csv += `Date Range,${fromDate} to ${toDate}\n\n`;
    csv += 'Branch,Credit,UPI,Cash,Total\n';

    rows.forEach(r => {
      csv += `"${r.branch}",${r.credit || 0},${r.upi || 0},${r.cash || 0},${r.total || 0}\n`;
    });

    csv += `Grand Total,${totalCredit},${totalUpi},${totalCash},${grandTotal}\n`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition',
      `attachment; filename=payment_branch_summary_${fromDate}_to_${toDate}.csv`
    );

    return res.send(csv);

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   EXPORT XLSX
========================================================= */

exports.exportBranchPaymentTableXlsx = async (req, res, next) => {
  try {
    const {
      fromDate, toDate,
      stateid, cityid, centreid, search,
      sortBy, sortOrder
    } = req.query;

    const rows = await model.exportBranchPaymentTable({
      fromDate, toDate,
      stateid, cityid, centreid, search,
      sortBy, sortOrder
    });

    let totalCredit = 0, totalUpi = 0, totalCash = 0, grandTotal = 0;

    rows.forEach(r => {
      totalCredit += Number(r.credit || 0);
      totalUpi += Number(r.upi || 0);
      totalCash += Number(r.cash || 0);
      grandTotal += Number(r.total || 0);
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Payment Summary');

    sheet.mergeCells('A1:E1');
    sheet.getCell('A1').value = 'Payment Branch Summary';
    sheet.getCell('A1').font = { size: 16, bold: true };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    sheet.mergeCells('A2:E2');
    sheet.getCell('A2').value = `Date Range: ${fromDate} to ${toDate}`;
    sheet.getCell('A2').alignment = { horizontal: 'center' };

    sheet.addRow([]);

    const headerRow = sheet.addRow(['Branch', 'Credit', 'UPI', 'Cash', 'Total']);

    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' }};
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' },
                      bottom: { style: 'thin' }, right: { style: 'thin' }};
    });

    rows.forEach(r => {
      sheet.addRow([r.branch, r.credit || 0, r.upi || 0, r.cash || 0, r.total || 0]);
    });

    const totalRow = sheet.addRow(['Grand Total', totalCredit, totalUpi, totalCash, grandTotal]);

    totalRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.border = { top: { style: 'double' }};
    });

    sheet.columns.forEach(col => col.width = 18);

    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',
      `attachment; filename=payment_branch_summary_${fromDate}_to_${toDate}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    next(err);
  }
};
