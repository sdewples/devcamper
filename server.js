const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env'});

// Initialize express app
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(
  PORT, 
  console.log(`App running in ${process.env.NODE_ENV} mode listening on port ${process.env.PORT}!`)
);