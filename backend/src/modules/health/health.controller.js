const db = require('../../config/db');

exports.healthCheck = async (req, res, next) => {
  try {
    await db.query('SELECT 1');

    res.status(200).json({
      success: true,
      server: 'up',
      database: 'connected',
      timestamp: new Date()
    });
  } catch (err) {
    next({
      status: 500,
      message: 'Database connection failed',
      error: err.message
    });
  }
};
