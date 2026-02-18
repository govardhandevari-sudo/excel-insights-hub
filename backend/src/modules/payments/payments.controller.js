const ExcelJS = require('exceljs');
const response = require('../common/response.util');
const { getPagination } = require('../common/pagination.util');
const { getSort } = require('../common/sort.util');
//const { isValidDDMMYYYY } = require('../common/date.util');
const model = require('./payments.model');

exports.getPaymentFilters = async (req, res, next) => {
  try {
    const { stateid, cityid } = req.query;

    const data = await model.getPaymentFilters({ stateid, cityid });

    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};

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
      const mode = r.paymentmode.toLowerCase();
      const amt = Number(r.amount || 0);

      if (mode === 'cash') cash += amt;
      else if (mode === 'credit') credit += amt;
      else digital += amt; // UPI, Card, etc
    });

    const total = credit + cash + digital;
    const pct = v => total ? Math.round((v / total) * 100) : 0;

    return response.success(res, {
      credit: { amount: credit, percentage: pct(credit) },
      upi: { amount: digital, percentage: pct(digital) },
      cash: { amount: cash, percentage: pct(cash) },
      digitalAdoption: { percentage: pct(digital) }
    });
  } catch (err) {
    next(err);
  }
};
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
    let summary = { credit: 0, upi: 0, cash: 0 };

    rows.forEach(r => {
      if (!branchesMap[r.centreid]) {
        branchesMap[r.centreid] = {
          centreid: r.centreid,
          centre: r.centre,
          credit: 0,
          upi: 0,
          cash: 0
        };
      }

      const mode = r.paymentmode.toLowerCase();
      const amt = Number(r.amount || 0);

      if (mode === 'cash') {
        branchesMap[r.centreid].cash += amt;
        summary.cash += amt;
      } else if (mode === 'credit') {
        branchesMap[r.centreid].credit += amt;
        summary.credit += amt;
      } else {
        branchesMap[r.centreid].upi += amt; // UPI / Card / etc
        summary.upi += amt;
      }
    });

    return response.success(res, {
      summary,
      branches: Object.values(branchesMap)
    });
  } catch (err) {
    next(err);
  }
};

exports.getBranchPaymentTable = async (req, res, next) => {
  try {
    const {
      fromDate, toDate,
      stateid, cityid, centreid, search
    } = req.query;

    /*if (!isValidDDMMYYYY(fromDate) || !isValidDDMMYYYY(toDate)) {
      return response.error(res, 'Invalid date format. Use DD-MM-YYYY', 400);
    } */

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

    const data = rows.map(r => {
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
      data,
      pagination: {
        page,
        perPage: limit,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.exportBranchPaymentTable = async (req, res, next) => {
  try {
    const {
      fromDate, toDate,
      stateid, cityid, centreid, search,
      sortBy, sortOrder
    } = req.query;

  /*  if (!isValidDDMMYYYY(fromDate) || !isValidDDMMYYYY(toDate)) {
      return response.error(res, 'Invalid date format. Use DD-MM-YYYY', 400);
    } */

    const rows = await model.exportBranchPaymentTable({
      fromDate, toDate,
      stateid, cityid, centreid, search,
      sortBy, sortOrder
    });

    // Compute grand totals
    let totalCredit = 0, totalUpi = 0, totalCash = 0, grandTotal = 0;

    rows.forEach(r => {
      totalCredit += Number(r.credit || 0);
      totalUpi += Number(r.upi || 0);
      totalCash += Number(r.cash || 0);
      grandTotal += Number(r.total || 0);
    });

    let csv = '';

    // Report title
    csv += 'Payment Branch Summary\n';

    // Date range
    csv += `Date Range,${fromDate} to ${toDate}\n\n`;

    // Table header
    csv += 'Branch,Credit,UPI,Cash,Total\n';

    // Data rows
    rows.forEach(r => {
      csv += `"${r.branch}",${r.credit || 0},${r.upi || 0},${r.cash || 0},${r.total || 0}\n`;
    });

    // Grand total row
    csv += `Grand Total,${totalCredit},${totalUpi},${totalCash},${grandTotal}\n`;

    const filename = `payment_branch_summary_${fromDate}_to_${toDate}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    return res.send(csv);
  } catch (err) {
    next(err);
  }
};

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

    // Grand totals
    let totalCredit = 0, totalUpi = 0, totalCash = 0, grandTotal = 0;

    rows.forEach(r => {
      totalCredit += Number(r.credit || 0);
      totalUpi += Number(r.upi || 0);
      totalCash += Number(r.cash || 0);
      grandTotal += Number(r.total || 0);
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Payment Summary');

    /* ---------- Title ---------- */
    sheet.mergeCells('A1:E1');
    sheet.getCell('A1').value = 'Payment Branch Summary';
    sheet.getCell('A1').font = { size: 16, bold: true };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    /* ---------- Date Range ---------- */
    sheet.mergeCells('A2:E2');
    sheet.getCell('A2').value = `Date Range: ${fromDate} to ${toDate}`;
    sheet.getCell('A2').alignment = { horizontal: 'center' };

    sheet.addRow([]);

    /* ---------- Header ---------- */
    const headerRow = sheet.addRow([
      'Branch', 'Credit', 'UPI', 'Cash', 'Total'
    ]);

    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    /* ---------- Data ---------- */
    rows.forEach(r => {
      sheet.addRow([
        r.branch,
        r.credit || 0,
        r.upi || 0,
        r.cash || 0,
        r.total || 0
      ]);
    });

    /* ---------- Grand Total ---------- */
    const totalRow = sheet.addRow([
      'Grand Total',
      totalCredit,
      totalUpi,
      totalCash,
      grandTotal
    ]);

    totalRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'double' }
      };
    });

    /* ---------- Column Widths ---------- */
    sheet.columns.forEach(col => {
      col.width = 18;
    });

    /* ---------- Response ---------- */
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=payment_branch_summary_${fromDate}_to_${toDate}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};
