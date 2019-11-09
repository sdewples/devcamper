const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');


// Load env vars
dotenv.config({ path: './config/config.env'});

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

// Initialize express app
const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// logs using morgan module in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File Upload
app.use(fileupload());

// Set the public folder to static
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

// logs and converts error data from html to json
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT, 
  console.log(`App running in ${process.env.NODE_ENV} mode listening on port ${process.env.PORT}!`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.underline.bold);
  
  // Close server and exit process if server fails
  server.close(() => process.exit(1));
});