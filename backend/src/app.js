const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', require('./modules/health/health.routes'));
app.use('/api/states', require('./modules/state/state.routes'));
app.use('/api/cities', require('./modules/city/city.routes'));
app.use('/api/centres', require('./modules/centre/centre.routes'));
app.use('/api/payments', require('./modules/payments/payments.routes'));



// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
