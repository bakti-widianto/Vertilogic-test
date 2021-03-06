var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();

const db_name = path.join(__dirname, "database.sqlite")
const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log("Successful connention to the database 'database.sqlite'")
})

var vendorRouter = require('./routes/vendors')(db);
var tagRouter = require('./routes/tags')(db);
var usersRouter = require('./routes/users')(db);
var orderRouter = require('./routes/orders')(db);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/vendors', vendorRouter);
app.use('/api/tags', tagRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', orderRouter);

module.exports = app;
