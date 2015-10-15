$(window).load(function() {

var State = function(){
  var checked = [];
  var boxes = $("input:checkbox[name='days']:checked");
  boxes.each(function(index,val){
   checked.push(val.value);
  });

  this.state = { days: checked,
              startHours: $("select[name='startHours']").val(),
              startMinutes: $("select[name='startMinutes']").val(),
              startPost: $("select[name='startPost']").val(),
              endHours: $("select[name='endHours']").val(),
              endMinutes: $("select[name='endMinutes']").val(),
              endPost: $("select[name='endPost']").val(),
              departments: $("select[name='departments']").val() };
            };



var $form = $( "form" ).get(0);
$form.addEventListener('change', function(change){
   var $state = new State();
   $("ul.classes-list").empty();
   $.get("/up", $state.state, function(data){
        data = JSON.parse(data);
        for(var d in data){
          var row =  data[d];
          days_array = JSON.parse(row.days);
          var days = '';
          for (var day in days_array){
            days += ' '+days_array[day]+' ';
          }
          var insert = '<li class="res">' + row.name +' - '+ row.number +' - '+days+' - '+row.times+'<p></li>';
          $("ul.classes-list").append(insert);
        }
      });
}, false);



$('#multi-select').multiSelect({
  afterSelect: function(values){
     var $state = new State();
     $("ul.classes-list").empty();
   $.get("/up", $state.state, function(data){
        data = JSON.parse(data);
        console.log(data);
        for(var d in data){
          var row =  data[d];
          days_array = JSON.parse(row.days);
          var days = '';
          for (var day in days_array){
            days += ' '+days_array[day]+' ';
          }
          var insert = '<li class="res">' + row.name +' - '+ row.number +' - '+days+' - '+row.times+'</li>';
          $("ul.classes-list").append(insert);
        }
      });
  },
  afterDeselect: function(values){
     var $state = new State();
     $("ul.classes-list").empty();
   $.get("/up", $state.state, function(data){
        data = JSON.parse(data);
        for(var d in data){
          var row =  data[d];
          days_array = JSON.parse(row.days);
          var days = '';
          for (var day in days_array){
            days += ' '+days_array[day]+' ';
          }
          var insert = '<li class="res">' + row.name +' - '+ row.number +' - '+days+' - '+row.times+'</li>';
          $("ul.classes-list").append(insert);
        }
      });
  }
});
});
