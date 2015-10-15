var express = require('express');
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
    var start24 = Hours * 100 + Minutes;
    if (Hours != 12 &&  Post == "pm"){
        start24 += 1200;
    }
    return start24;

}

router.get('/up', function(req, res){
    console.log(req.query);
    sql = 'SELECT * from class WHERE department ="';
    departments = req.query.departments;
    console.log(departments);
    if(Array.isArray(departments)){
    sql = sql + departments.join('" OR department = "') + '"';
    }else{
        sql = sql + departments +'"';
    }
     if (departments === ""){
        sql = 'SELECT * from class';
    }
    var start_time = get24(req.query.startHours,req.query.startMinutes,req.query.startPost);
    var end_time = get24(req.query.endHours, req.query.endMinutes, req.query.endPost);
    found_classes = [];
    console.log(sql);
    req.app.get('connection').query(sql, function(err, rows){

    for(var i in rows){
        console.log(rows[i]);
        var row = rows[i];
        if ((Number(row.start24) >= start_time) && (Number(row.end24) <= end_time)){
           var days = JSON.parse(row.days);
           var req_days = req.query.days;
           if (req_days !== undefined){
           if(days.toString() == req_days.toString()){
            found_classes.push(row);
        }
    }
        }
    }
    res.end(JSON.stringify(found_classes));
    });
   
});
module.exports = router;
