var fs = require('fs');
var mysql = require('mysql');




var client = mysql.createConnection({
    port: 3307,
    host     : 'localhost',
    user     : 'root',
    password : 'blank',
    database : 'classes'
});

client.connect(function(err){
  if(err){
    console.log('Error connecting to db');
    return;
}
console.log('Connection established');
var fs = require('fs');
var content = fs.readFileSync("classes.json");
var jsonContent = JSON.parse(content);
sql = 'TRUNCATE table class';
client.query(sql);
for (var obj in jsonContent){
    object = jsonContent[obj];
    var sql = 'INSERT INTO class SET ?';
    values = {department : object.department, name : object.name, days: JSON.stringify(object.days), times : object.hours,
    start24 : object.start24, end24: object.end24, instructor : object.instructor, number : object.number};
    client.query(sql,values);
}
client.end(function(err, res){
    if (err) throw err;
    if (!err){
        console.log("Connection terminated successfully");
    }
});
});

