const db = require('../common/base.repository');

exports.getTargetHistory = async ({ salespersonId }) => {
  return db.query(
    `
    SELECT
      id,
      salesperson_id AS salespersonId,
      salesperson_name AS salespersonName,
      branch,
      region,
      start_date AS startDate,
      end_date AS endDate,
      target_amount AS targetAmount,
      notes,
      created_at AS createdAt
    FROM salesperson_target_history
    WHERE salesperson_id = ?
    ORDER BY start_date DESC, created_at DESC
    `,
    [salespersonId]
  );
};

exports.addTarget = async ({
  salespersonId,
  salespersonName,
  branch,
  region,
  startDate,
  endDate,
  targetAmount,
  notes
}) => {
  const sql = `
    INSERT INTO salesperson_target_history (
      salesperson_id,
      salesperson_name,
      branch,
      region,
      start_date,
      end_date,
      target_amount,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await db.query(sql, [
    salespersonId,
    salespersonName,
    branch || null,
    region || null,
    startDate,
    endDate,
    targetAmount,
    notes || null
  ]);

  return result.insertId;
};

exports.deleteTarget = async ({ id }) => {
  const result = await db.query(
    `DELETE FROM salesperson_target_history WHERE id = ?`,
    [id]
  );

  return result.affectedRows || 0;
};


const { getLocationFilters } = require('../common/locationFilters.model');

exports.getSalespersonFilters = async ({ stateid, cityid }) => {
  return getLocationFilters({ stateid, cityid });
};

exports.getSalespersons = async ({ stateid, cityid, centreid, search }) => {
  const where = ['e.IsActive = 1'];
  const values = [];

  if (stateid) {
    where.push('c.StateID = ?');
    values.push(stateid);
  }

  if (cityid) {
    where.push('c.CityID = ?');
    values.push(cityid);
  }

  if (centreid) {
    where.push('c.CentreID = ?');
    values.push(centreid);
  }

  if (search) {
    where.push('e.Name LIKE ?');
    values.push(`%${search}%`);
  }

  const sql = `
    SELECT DISTINCT
      CAST(e.Employee_ID AS CHAR) AS id,
      e.Name AS name,
      COALESCE(c.Centre, '') AS branch,
      COALESCE(c.State, '') AS region,
      c.CentreID AS centreid,
      c.CityID AS cityid,
      c.StateID AS stateid
    FROM employee_master e
    LEFT JOIN salesperson_centre_map scm
      ON scm.salesperson_id = e.Employee_ID
      AND scm.is_active = 1
    LEFT JOIN centre_master c
      ON c.CentreID = scm.centre_id
      AND c.isActive = 1
    WHERE ${where.join(' AND ')}
    ORDER BY e.Name
  `;

  return db.query(sql, values);
};
