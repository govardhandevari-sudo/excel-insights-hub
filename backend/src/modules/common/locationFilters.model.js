const db = require('../common/base.repository');
const mysql = require('mysql2');

exports.getLocationFilters = async ({ stateid, cityid }) => {
  const filters = {};

  /* STATES */
  filters.states = await db.query(`
    SELECT id, state
    FROM state_master
    WHERE IsActive = 1
    ORDER BY state
  `);

  /* CITIES */
  let citySql = `
    SELECT 
      cm.ID AS id,
      cm.City AS city,
      cm.stateID AS stateid,
      sm.state
    FROM city_master cm
    JOIN state_master sm 
      ON sm.id = cm.stateID 
      AND sm.IsActive = 1
    WHERE cm.IsActive = 1
  `;

  if (stateid) {
    filters.cities = await db.query(
      citySql + ` AND cm.stateID = ? ORDER BY state ASC, city ASC`,
      [stateid]
    );
  } else {
    filters.cities = await db.query(
      citySql + ` ORDER BY state ASC, city ASC`
    );
  }

  /* CENTRES */
  const centreValues = [];
  let centreSql = `
    SELECT 
      c.CentreID AS centreid,
      c.Centre   AS centre,
      c.StateID  AS stateid,
      c.CityID   AS cityid
    FROM centre_master c
    JOIN state_master sm 
      ON sm.id = c.StateID 
      AND sm.IsActive = 1
    JOIN city_master cm 
      ON cm.ID = c.CityID 
      AND cm.IsActive = 1
    WHERE c.isActive = 1
  `;

  if (stateid) {
    centreSql += ` AND c.StateID = ?`;
    centreValues.push(stateid);
  }

  if (cityid) {
    centreSql += ` AND c.CityID = ?`;
    centreValues.push(cityid);
  }

  filters.centres = await db.query(
    centreSql + ` ORDER BY c.Centre`,
    centreValues
  );

  return filters;
};
