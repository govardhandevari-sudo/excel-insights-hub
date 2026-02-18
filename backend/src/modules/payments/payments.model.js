const db = require('../common/base.repository');
const mysql = require('mysql2');

exports.getPaymentFilters = async ({ stateid, cityid }) => {
  const filters = {};
  const where = [];
  const values = [];

  /* States */
  filters.states = await db.query(
    `SELECT id, state FROM state WHERE isactive = 1 ORDER BY state`
  );

  /* Cities */
  let citySql = `SELECT id, city, stateid FROM city WHERE isactive = 1`;
  if (stateid) {
    citySql += ` AND stateid = ?`;
    filters.cities = await db.query(citySql + ` ORDER BY city`, [stateid]);
  } else {
    filters.cities = await db.query(citySql + ` ORDER BY city`);
  }

  /* Centres */
  let centreSql = `
    SELECT centreid, centre, stateid, cityid
    FROM centre
    WHERE isactive = 1
  `;

  if (stateid) {
    centreSql += ` AND stateid = ?`;
    values.push(stateid);
  }
  if (cityid) {
    centreSql += ` AND cityid = ?`;
    values.push(cityid);
  }

  filters.centres = await db.query(centreSql + ` ORDER BY centre`, values);

  /* Payment modes (AUTHORITATIVE SOURCE) */
  filters.paymentModes = await db.query(
    `SELECT paymentmodeid, paymentmode
     FROM payment_mode
     WHERE active = 1
     ORDER BY paymentmode`
  );

  return filters;
};
exports.getPaymentSummaryByMode = async ({
  fromDate,
  toDate,
  stateid,
  cityid,
  centreid
}) => {
  const where = [];
  const values = [];

  where.push(`DATE(r.entrydatetime) BETWEEN ? AND ?`);
  values.push(fromDate, toDate);

  if (centreid) {
    where.push(`lt.centreid = ?`);
    values.push(centreid);
  }
  if (cityid) {
    where.push(`c.cityid = ?`);
    values.push(cityid);
  }
  if (stateid) {
    where.push(`c.stateid = ?`);
    values.push(stateid);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sql = `
    SELECT
      pm.paymentmodeid,
      pm.paymentmode,
      SUM(r.amount) AS amount
    FROM f_reciept r
    JOIN payment_mode pm ON pm.paymentmodeid = r.paymentmodeid
    left JOIN f_ledgertransaction lt ON lt.ledgertransactionid = r.ledgertransactionid
    left JOIN centre c ON c.centreid = lt.centreid
    ${whereClause}
    GROUP BY pm.paymentmodeid, pm.paymentmode
  `;
console.log(
  mysql.format(sql, values)
);

  return db.query(sql, values);
};
exports.getBranchPaymentDistribution = async ({
  fromDate,
  toDate,
  stateid,
  cityid,
  centreid
}) => {
  const where = [];
  const values = [];

  where.push(`DATE(r.entrydatetime) BETWEEN ? AND ?`);
  values.push(fromDate, toDate);

  if (centreid) {
    where.push(`c.centreid = ?`);
    values.push(centreid);
  }
  if (cityid) {
    where.push(`c.cityid = ?`);
    values.push(cityid);
  }
  if (stateid) {
    where.push(`c.stateid = ?`);
    values.push(stateid);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sql = `
    SELECT
      c.centreid,
      c.centre,
      pm.paymentmode,
      SUM(r.amount) AS amount
    FROM f_reciept r
    JOIN payment_mode pm ON pm.paymentmodeid = r.paymentmodeid
    left JOIN f_ledgertransaction lt ON lt.ledgertransactionid = r.ledgertransactionid
    left JOIN centre c ON c.centreid = lt.centreid
    ${whereClause}
    GROUP BY c.centreid, c.centre, pm.paymentmode
    ORDER BY c.centre
  `;

  return db.query(sql, values);
};

const DATE_EXPR = `
STR_TO_DATE(SUBSTRING(r.entrydatetime,1,10), '%d-%m-%Y')
`;

exports.getBranchPaymentTable = async ({
  fromDate, toDate,
  stateid, cityid, centreid, search,
  sortBy, sortOrder,
  limit, offset
}) => {
  const where = [];
  const values = [];

  where.push(`
    ${DATE_EXPR} BETWEEN
    STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
  `);
  values.push(fromDate, toDate);

  if (centreid) { where.push(`c.centreid = ?`); values.push(centreid); }
  if (cityid)   { where.push(`c.cityid = ?`); values.push(cityid); }
  if (stateid)  { where.push(`c.stateid = ?`); values.push(stateid); }
  if (search)   { where.push(`c.centre LIKE ?`); values.push(`%${search}%`); }

  const whereClause = `WHERE ${where.join(' AND ')}`;

  // Map sort keys to SQL-safe expressions
  const sortMap = {
    centre: 'c.centre',
    credit: 'credit',
    upi: 'upi',
    cash: 'cash',
    total: 'total'
  };
  const orderCol = sortMap[sortBy] || 'c.centre';

  const sql = `
    SELECT
      c.centreid,
      c.centre AS branch,
      SUM(CASE WHEN pm.paymentmode = 'Credit' THEN r.amount ELSE 0 END) AS credit,
      SUM(CASE WHEN pm.paymentmode = 'Cash' THEN r.amount ELSE 0 END) AS cash,
      SUM(CASE WHEN pm.paymentmode NOT IN ('Cash','Credit') THEN r.amount ELSE 0 END) AS upi,
      SUM(r.amount) AS total
    FROM f_reciept r
    JOIN payment_mode pm ON pm.paymentmodeid = r.paymentmodeid
    left JOIN f_ledgertransaction lt ON lt.ledgertransactionid = r.ledgertransactionid
    left JOIN centre c ON c.centreid = lt.centreid
    ${whereClause}
    GROUP BY c.centreid, c.centre
    ORDER BY ${orderCol} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  const rows = await db.query(sql, [...values, limit, offset]);
  return rows;
};

exports.countBranchPaymentTable = async ({
  fromDate, toDate,
  stateid, cityid, centreid, search
}) => {
  const where = [];
  const values = [];

  where.push(`
    ${DATE_EXPR} BETWEEN
    STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
  `);
  values.push(fromDate, toDate);

  if (centreid) { where.push(`c.centreid = ?`); values.push(centreid); }
  if (cityid)   { where.push(`c.cityid = ?`); values.push(cityid); }
  if (stateid)  { where.push(`c.stateid = ?`); values.push(stateid); }
  if (search)   { where.push(`c.centre LIKE ?`); values.push(`%${search}%`); }

  const whereClause = `WHERE ${where.join(' AND ')}`;

  const sql = `
    SELECT COUNT(*) AS totalRecords
    FROM (
      SELECT c.centreid
      FROM f_reciept r
      left JOIN f_ledgertransaction lt ON lt.ledgertransactionid = r.ledgertransactionid
      left JOIN centre c ON c.centreid = lt.centreid
      ${whereClause}
      GROUP BY c.centreid
    ) x
  `;

  const res = await db.query(sql, values);
  return res[0]?.totalRecords || 0;
};
exports.exportBranchPaymentTable = async ({
  fromDate, toDate,
  stateid, cityid, centreid, search,
  sortBy, sortOrder
}) => {
  const where = [];
  const values = [];

  const DATE_EXPR = `
    STR_TO_DATE(SUBSTRING(r.entrydatetime,1,10), '%d-%m-%Y')
  `;

  where.push(`
    ${DATE_EXPR} BETWEEN
    STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
  `);
  values.push(fromDate, toDate);

  if (centreid) { where.push(`c.centreid = ?`); values.push(centreid); }
  if (cityid)   { where.push(`c.cityid = ?`); values.push(cityid); }
  if (stateid)  { where.push(`c.stateid = ?`); values.push(stateid); }
  if (search)   { where.push(`c.centre LIKE ?`); values.push(`%${search}%`); }

  const whereClause = `WHERE ${where.join(' AND ')}`;

  const sortMap = {
    centre: 'c.centre',
    credit: 'credit',
    upi: 'upi',
    cash: 'cash',
    total: 'total'
  };
  const orderCol = sortMap[sortBy] || 'c.centre';

  const sql = `
    SELECT
      c.centre AS branch,
      SUM(CASE WHEN pm.paymentmode = 'Credit' THEN r.amount ELSE 0 END) AS credit,
      SUM(CASE WHEN pm.paymentmode = 'Cash' THEN r.amount ELSE 0 END) AS cash,
      SUM(CASE WHEN pm.paymentmode NOT IN ('Cash','Credit') THEN r.amount ELSE 0 END) AS upi,
      SUM(r.amount) AS total
    FROM f_reciept r
    JOIN payment_mode pm ON pm.paymentmodeid = r.paymentmodeid
    JOIN f_ledgertransaction lt ON lt.ledgertransactionid = r.ledgertransactionid
    JOIN centre c ON c.centreid = lt.centreid
    ${whereClause}
    GROUP BY c.centreid, c.centre
    ORDER BY ${orderCol} ${sortOrder || 'ASC'}
  `;

  return db.query(sql, values);
};
