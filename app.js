var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var routes = require('./routes/index');


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/up', routes);

module.exports = app;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var environ = app.get('env');
var connection;

function get_connection (){
switch (environ) {
  case 'development':
    connection =  mysql.createConnection({
      port: 3307,
      host     : 'localhost',
      user     : 'root',
      password : 'blank',
      database : 'classes'
    });
  break;
  case 'stage':
  connection = mysql.createConnection({
      host     : 'promodb-stage.cygnvapjclbd.us-west-2.rds.amazonaws.com',
      user     : 'stagedb',
      password : 'timDB$!34',
      database : 'promodb'
    });
  break;
  case 'production':
   connection = mysql.createConnection(process.env.DATABASE_URL);
   break;
  }
}

get_connection();
connection.connect();
// error handlers

function handleDisconnect(myConnection) {
  myConnection.on('error', function (error) {
    if (!error.fatal) return;
    if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw err;
    console.error('> Re-connecting lost MySQL connection: ' + error.stack);
    myConnection.destroy();
    get_connection();
    handleDisconnect(connection);
    connection.connect();
});
}

handleDisconnect(connection);
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.set('populate',function(){
var fs = require('fs');
var content = fs.readFileSync("classes.json");
var jsonContent = JSON.parse(content);
sql = 'TRUNCATE table class';
app.get('connection').query(sql);
for (var obj in jsonContent){
  object = jsonContent[obj];
  var sql = 'INSERT INTO class SET ?';
  values = {department : object.department, name : object.name, days: JSON.stringify(object.days), times : object.hours,
    start24 : object.start24, end24: object.end24, instructor : object.instructor, number : object.number};
    app.get('connection').query(sql,values);
  }
});


module.exports = app;
