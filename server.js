const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
//const logger = require('./middleware/logger');

// load env vars
dotenv.config({ path: './config/config.env'});
// Coonect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();
// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
}

// File upload 
app.use(fileupload());

// Santitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent xss attack
app.use(xss());

// rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
});

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

// Listen port
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`.red);
    //close server and exit server
    server.close(() => process.exit(1));
});