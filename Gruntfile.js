

var app = require('./app');
var fs = require('fs');
var mysql = require('mysql');



module.exports = function(grunt) {
    grunt.registerTask('populate', 'Log some stuff.', function() {

   app.set('connection', mysql.createConnection({
      port: 3307,
      host     : 'localhost',
      user     : 'root',
      password : 'blank',
      database : 'classes'
    }));

   app.get('connection').connect(function(err){
  if(err){
    grunt.log.write('Error connecting to db');
    return;
  }
  grunt.log.write('Connection established');
});
var obj;
fs.readFile('./classes.json', 'utf8', function (err, data) {
  if (err) throw err;
  console.log("parsed");
  obj = JSON.parse(data);
  console.log(obj);
});
  });
};