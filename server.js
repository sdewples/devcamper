const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');

// Route files
const bootcamps = require('./routes/bootcamps');

// Load env vars
dotenv.config({ path: './config/config.env'});

// Initialize express app
const app = express();

// logger is called every time a request is recieved
app.use(logger);

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT, 
  console.log(`App running in ${process.env.NODE_ENV} mode listening on port ${process.env.PORT}!`)
);