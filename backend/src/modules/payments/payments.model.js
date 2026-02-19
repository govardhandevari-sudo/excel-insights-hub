const db = require('../common/base.repository');
const mysql = require('mysql2');

// ─── Schema reference ────────────────────────────────────────────────────────
// state_master   : id, state, IsActive, dtEntry, Updatedate
// city_master    : ID, City, stateID, Country, UpdateDate, IsActive, dtEntry
// centre_master  : CentreID, CentreCode, Centre, isActive, Landline, Mobile,
//                  Email, Address, CityID, City, StateID, State, dtEntry
// payment_mode   : PaymentModeId, PaymentMode, Active
// f_reciept      : ID, ReceiptNo, LedgerTransactionID, LedgerTransactionNo,
//                  PaymentModeID, PaymentMode, Amount, EntryDateTime, CentreID,
//                  IsCancel, ...
// f_ledgertransaction : LedgerTransactionID, LedgerTransactionNo, CentreID,
//                       Patient_ID, Date, NetAmount, GrossAmount, ...
// ─────────────────────────────────────────────────────────────────────────────

exports.getPaymentFilters = async ({ stateid, cityid }) => {
  const filters = {};

  /* States */
  filters.states = await db.query(
    `SELECT id, state
     FROM state_master
     WHERE IsActive = 1
     ORDER BY state`
  );

  /* Cities */
  let citySql = `SELECT cm.ID AS id, cm.City AS city, cm.stateID AS stateid, sm.state
                 FROM city_master cm
                 join state_master sm on sm.id = cm.stateID and sm.IsActive = 1
                 WHERE cm.IsActive = 1 order by state asc, city asc`;
  if (stateid) {
    filters.cities = await db.query(
      citySql + ` AND stateID = ? ORDER BY City`,
      [stateid]
    );
  } else {
    filters.cities = await db.query(citySql + ` ORDER BY City`);
  }

  /* Centres */
  const centreValues = [];
  let centreSql = `
                  SELECT 
                    c.CentreID AS centreid,
                    c.Centre   AS centre,
                    c.StateID  AS stateid,
                    c.CityID   AS cityid
                FROM centre_master c
                JOIN state_master sm ON sm.id      = c.StateID AND sm.IsActive = 1
                JOIN city_master  cm ON cm.ID      = c.CityID  AND cm.IsActive = 1
                WHERE c.isActive = 1
                ORDER BY c.Centre`;

  if (stateid) {
    centreSql += ` AND StateID = ?`;
    centreValues.push(stateid);
  }
  if (cityid) {
    centreSql += ` AND CityID = ?`;
    centreValues.push(cityid);
  }

  filters.centres = await db.query(
    centreSql + ` ORDER BY Centre`,
    centreValues
  );

  /* Payment modes */
  filters.paymentModes = await db.query(
    `SELECT PaymentModeId AS paymentmodeid,
            PaymentMode   AS paymentmode
     FROM payment_mode
     WHERE Active = 1
     ORDER BY PaymentMode`
  );

  return filters;
};

// ─────────────────────────────────────────────────────────────────────────────

exports.getPaymentSummaryByMode = async ({
  fromDate,
  toDate,
  stateid,
  cityid,
  centreid
}) => {
  const where = [];
  const values = [];

  where.push(`DATE(r.EntryDateTime) BETWEEN ? AND ?`);
  values.push(fromDate, toDate);

  if (centreid) {
    where.push(`lt.CentreID = ?`);
    values.push(centreid);
  }
  if (cityid) {
    where.push(`c.CityID = ?`);
    values.push(cityid);
  }
  if (stateid) {
    where.push(`c.StateID = ?`);
    values.push(stateid);
  }

  // Exclude cancelled receipts
  where.push(`r.IsCancel = 0`);

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sql = `
    SELECT
      pm.PaymentModeId  AS paymentmodeid,
      pm.PaymentMode    AS paymentmode,
      SUM(r.Amount)     AS amount
    FROM f_reciept r
    JOIN  payment_mode        pm ON pm.PaymentModeId       = r.PaymentModeID
    LEFT JOIN f_ledgertransaction lt ON lt.LedgerTransactionID = r.LedgerTransactionID
    LEFT JOIN centre_master       c  ON c.CentreID             = lt.CentreID
    ${whereClause}
    GROUP BY pm.PaymentModeId, pm.PaymentMode
    ORDER BY pm.PaymentMode
  `;

  console.log(mysql.format(sql, values));

  return db.query(sql, values);
};

// ─────────────────────────────────────────────────────────────────────────────

exports.getBranchPaymentDistribution = async ({
  fromDate,
  toDate,
  stateid,
  cityid,
  centreid
}) => {
  const where = [];
  const values = [];

  where.push(`DATE(r.EntryDateTime) BETWEEN ? AND ?`);
  values.push(fromDate, toDate);

  if (centreid) {
    where.push(`c.CentreID = ?`);
    values.push(centreid);
  }
  if (cityid) {
    where.push(`c.CityID = ?`);
    values.push(cityid);
  }
  if (stateid) {
    where.push(`c.StateID = ?`);
    values.push(stateid);
  }

  where.push(`r.IsCancel = 0`);

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sql = `
    SELECT
      c.CentreID     AS centreid,
      c.Centre       AS centre,
      pm.PaymentMode AS paymentmode,
      SUM(r.Amount)  AS amount
    FROM f_reciept r
    JOIN  payment_mode        pm ON pm.PaymentModeId       = r.PaymentModeID
    LEFT JOIN f_ledgertransaction lt ON lt.LedgerTransactionID = r.LedgerTransactionID
    LEFT JOIN centre_master       c  ON c.CentreID             = lt.CentreID
    ${whereClause}
    GROUP BY c.CentreID, c.Centre, pm.PaymentMode
    ORDER BY c.Centre
  `;

  return db.query(sql, values);
};

// ─────────────────────────────────────────────────────────────────────────────

exports.getBranchPaymentTable = async ({
  fromDate, toDate,
  stateid, cityid, centreid, search,
  sortBy, sortOrder,
  limit, offset
}) => {
  const where = [];
  const values = [];

  // EntryDateTime is stored as a proper DATETIME — use DATE() directly
  where.push(`DATE(r.EntryDateTime) BETWEEN ? AND ?`);
  values.push(fromDate, toDate);

  if (centreid) { where.push(`c.CentreID = ?`);  values.push(centreid); }
  if (cityid)   { where.push(`c.CityID = ?`);    values.push(cityid);   }
  if (stateid)  { where.push(`c.StateID = ?`);   values.push(stateid);  }
  if (search)   { where.push(`c.Centre LIKE ?`); values.push(`%${search}%`); }

  where.push(`r.IsCancel = 0`);

  const whereClause = `WHERE ${where.join(' AND ')}`;

  const sortMap = {
    centre : 'c.Centre',
    credit : 'credit',
    upi    : 'upi',
    cash   : 'cash',
    total  : 'total'
  };
  const orderCol   = sortMap[sortBy]    || 'c.Centre';
  const orderDir   = sortOrder === 'DESC' ? 'DESC' : 'ASC';

  const sql = `
    SELECT
      c.CentreID AS centreid,
      c.Centre   AS branch,
      SUM(CASE WHEN pm.PaymentMode = 'Credit'
               THEN r.Amount ELSE 0 END) AS credit,
      SUM(CASE WHEN pm.PaymentMode = 'Cash'
               THEN r.Amount ELSE 0 END) AS cash,
      SUM(CASE WHEN pm.PaymentMode NOT IN ('Cash', 'Credit')
               THEN r.Amount ELSE 0 END) AS upi,
      SUM(r.Amount)                        AS total
    FROM f_reciept r
    JOIN  payment_mode        pm ON pm.PaymentModeId       = r.PaymentModeID
    LEFT JOIN f_ledgertransaction lt ON lt.LedgerTransactionID = r.LedgerTransactionID
    LEFT JOIN centre_master       c  ON c.CentreID             = lt.CentreID
    ${whereClause}
    GROUP BY c.CentreID, c.Centre
    ORDER BY ${orderCol} ${orderDir}
    LIMIT ? OFFSET ?
  `;

  return db.query(sql, [...values, limit, offset]);
};

// ─────────────────────────────────────────────────────────────────────────────

exports.countBranchPaymentTable = async ({
  fromDate, toDate,
  stateid, cityid, centreid, search
}) => {
  const where = [];
  const values = [];

  where.push(`DATE(r.EntryDateTime) BETWEEN ? AND ?`);
  values.push(fromDate, toDate);

  if (centreid) { where.push(`c.CentreID = ?`);  values.push(centreid); }
  if (cityid)   { where.push(`c.CityID = ?`);    values.push(cityid);   }
  if (stateid)  { where.push(`c.StateID = ?`);   values.push(stateid);  }
  if (search)   { where.push(`c.Centre LIKE ?`); values.push(`%${search}%`); }

  where.push(`r.IsCancel = 0`);

  const whereClause = `WHERE ${where.join(' AND ')}`;

  const sql = `
    SELECT COUNT(*) AS totalRecords
    FROM (
      SELECT c.CentreID
      FROM f_reciept r
      LEFT JOIN f_ledgertransaction lt ON lt.LedgerTransactionID = r.LedgerTransactionID
      LEFT JOIN centre_master       c  ON c.CentreID             = lt.CentreID
      ${whereClause}
      GROUP BY c.CentreID
    ) x
  `;

  const res = await db.query(sql, values);
  return res[0]?.totalRecords || 0;
};

// ─────────────────────────────────────────────────────────────────────────────

exports.exportBranchPaymentTable = async ({
  fromDate, toDate,
  stateid, cityid, centreid, search,
  sortBy, sortOrder
}) => {
  const where = [];
  const values = [];

  where.push(`DATE(r.EntryDateTime) BETWEEN ? AND ?`);
  values.push(fromDate, toDate);

  if (centreid) { where.push(`c.CentreID = ?`);  values.push(centreid); }
  if (cityid)   { where.push(`c.CityID = ?`);    values.push(cityid);   }
  if (stateid)  { where.push(`c.StateID = ?`);   values.push(stateid);  }
  if (search)   { where.push(`c.Centre LIKE ?`); values.push(`%${search}%`); }

  where.push(`r.IsCancel = 0`);

  const whereClause = `WHERE ${where.join(' AND ')}`;

  const sortMap = {
    centre : 'c.Centre',
    credit : 'credit',
    upi    : 'upi',
    cash   : 'cash',
    total  : 'total'
  };
  const orderCol = sortMap[sortBy] || 'c.Centre';
  const orderDir = sortOrder === 'DESC' ? 'DESC' : 'ASC';

  const sql = `
    SELECT
      c.Centre  AS branch,
      SUM(CASE WHEN pm.PaymentMode = 'Credit'
               THEN r.Amount ELSE 0 END) AS credit,
      SUM(CASE WHEN pm.PaymentMode = 'Cash'
               THEN r.Amount ELSE 0 END) AS cash,
      SUM(CASE WHEN pm.PaymentMode NOT IN ('Cash', 'Credit')
               THEN r.Amount ELSE 0 END) AS upi,
      SUM(r.Amount)                        AS total
    FROM f_reciept r
    JOIN  payment_mode        pm ON pm.PaymentModeId       = r.PaymentModeID
    JOIN  f_ledgertransaction lt ON lt.LedgerTransactionID = r.LedgerTransactionID
    JOIN  centre_master       c  ON c.CentreID             = lt.CentreID
    ${whereClause}
    GROUP BY c.CentreID, c.Centre
    ORDER BY ${orderCol} ${orderDir}
  `;

  return db.query(sql, values);
};