var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    req.app.get('connection').query('SELECT DISTINCT(department) AS department from class ORDER BY department', function (err, departments) {
  for (var it in departments){
    console.log(departments[it]);
  }
  res.render('index', { title: 'Express', departments:departments });
});
});

router.post('/', function(req, res){
    console.log(req);
    sql = 'SELECT * from class WHERE (department ="';
    departments = req.body.departments;
    if(Array.isArray(departments)){
    sql = sql + departments.join('" OR department = "') + '")';
    }else{
        sql = sql + departments +')';
    }
    console.log(sql);
    req.app.get('connection').query(sql, function(err, rows){
        console.log(rows);
    });
});
module.exports = router;
