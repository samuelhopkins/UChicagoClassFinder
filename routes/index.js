var express = require('express');
var $ = require('jquery');
var router = express.Router();
var minutesNums = Array(60).join(0).split(0).map(Number.call, Number);
minutes = [];
for (var min in minutesNums){
    minute = String(minutesNums[min]);
    if (minute.length < 2){
        minute = "0"+minute;
    }
    minutes.push(minute);
}
//console.log(minutes);
/* GET home page. */
router.get('/', function(req, res) {
    req.app.get('connection').query('SELECT DISTINCT(department) AS department from class ORDER BY department', function (err, departments) {
        found_classes = null;
  res.render('index', { title: 'Express', departments:departments, found_classes:found_classes, minutes:minutes });
});
});

function get24(hours, minutes, post){
    var Hours = Number(hours);
    var Minutes = Number(minutes);
    var Post = post;
    console.log(Hours, Minutes, Post);
    var start24 = Hours * 100 + Minutes;
    if (Hours != 12 &&  Post == "pm"){
        start24 += 1200;
    }
    return start24;

}

router.post('/', function(req, res){
    sql = 'SELECT * from class WHERE department ="';
    departments = req.body.departments;
    if(Array.isArray(departments)){
    sql = sql + departments.join('" OR department = "') + '"';
    }else{
        sql = sql + departments +'"';
    }
     if (departments === undefined){
        sql = 'SELECT * from class';
    }
    var start_time = get24(req.body.startHours,req.body.startMinutes,req.body.startPost);
    var end_time = get24(req.body.endHours, req.body.startHours, req.body.endPost);
    found_classes = [];
    req.app.get('connection').query(sql, function(err, rows){
    for(var i in rows){
        var row = rows[i];
        if ((Number(row.start24) >= start_time) && (Number(row.end24) <= end_time)){
           var days = JSON.parse(row.days);
           console.log(days);
           var daysMatch = true;
           for(var j in req.body.days){
            day = req.body.days[j];
            if(days.indexOf(day) == -1){
                daysMatch = false;
            }
            
           }
           if(daysMatch){
            found_classes.push(row);
        }
        }
    }
    });
    req.app.get('connection').query('SELECT DISTINCT(department) AS department from class ORDER BY department', function (err, departments) {
    res.render('index', { title: 'Express', departments:departments, found_classes:found_classes, minutes:minutes });
    });
});
module.exports = router;
