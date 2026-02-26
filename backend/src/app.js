const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

const health = require('./modules/health/health.routes');
const deptRevenueRoutes = require("./modules/deptRevenue/deptRevenue.routes");
const PaymentModeRoutes = require('./modules/payments/payments.routes');
const salespersonTargetRoutes = require('./modules/salespersonTargets/salespersonTargets.routes');

// Routes

//app.use('/api/states', require('./modules/state/state.routes'));
//app.use('/api/cities', require('./modules/city/city.routes'));
//app.use('/api/centres', require('./modules/centre/centre.routes'));
app.use('/api/health', health);
app.use('/api/payments', PaymentModeRoutes);
app.use("/api/dept-revenue", deptRevenueRoutes);
app.use('/api/salesperson-targets', salespersonTargetRoutes);





// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
