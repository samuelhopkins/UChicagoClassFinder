$(window).load(function() {

var offset = 70;
for(var i =0; i < 8; i++){
  var newOffset = offset + (i * 50);
  var div = $('<div>').css({"top": newOffset.toString() + 'px'});
  div.addClass('line');
  $(".time-labels").append(div);
}
var classNum = 0;
var colors = ["#CC0200","#486CCC","#CC5F16","#CCB304", "#51216E"];
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


var Schedule = {'M':[],'T':[],'W':[],'R':[],'F':[]};

function doQuery(){
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
          var insert = '<li class="res"><p>' + row.name +' - '+ row.number +'    |       Days: '+days+'      |      Times: '+row.times+'</p><p> Instructor: '+row.instructor +'</p><a class="details" href='+row.link+' target="_blank">Course Details</a>' +
          '<span class="add" data-days="'+days_array+'" data-times="'+row.times+'" name="'+row.name+'"> Add to schedule<span></li>';
          $("ul.classes-list").append(insert);
        }
        addClick();
      });
}

function showSchedule(){
   $("div.schedule").toggle(function(){
      $('div.focus').toggle();
      $('div.focus').css({"background-color" : "rgba(0,0,0,0)"});
    },
    function(){
      $('div.focus').toggle();
       $('div.focus').css({"background-color" : "rgba(0,0,0,0.7)"});
    }
  );
}

$("#show-schedule").on('click', function(){
  showSchedule();
});

$("#close-schedule").on('click', function(){
  showSchedule();
});

$('#clear-schedule').click(function(){
  var day_table={'M':'monday', 'T':'tuesday','W':'wednesday','R':'thursday','F':'friday'};
  $.each(day_table, function(key,val){
    $('#'+val +' > div.block-class').remove();
    Schedule[key] = [];
  });
  classNum = 0;
});


function addClick(){
$("span.add").on('click',function(){
  var time = $(this).data('times');
  var split = time.split("-");
  var name = $(this).attr('name');
  var startTime = split[0];
  var endTime = split[1];
  var days = $(this).data('days').split(',');
  var start24 = get24(startTime.substring(0,2), startTime.substring(3,5), startTime.substring(5,7));
  var end24 = get24(endTime.substring(0,2), endTime.substring(3,5), endTime.substring(5,7));
  addToSchedule(time,name,days,start24,end24);
});
}

function addToSchedule(time,name,days,start24,end24){
  var day_table={'M':'monday', 'T':'tuesday','W':'wednesday','R':'thursday','F':'friday'};
  if (classNum > 4){
    alert("You cannot schedule more than 5 classes at once.");
    return;
  }
  if (checkScheduleSpace(start24,end24,days) === false){
    alert("Time slot " + time + ' on ' +days.toString() + ' is already filled');
    return;
  }
  var startMins = (Math.floor(start24/100) * 60) + (start24 % 100);
  var endMins = (Math.floor(end24/100) * 60) + (end24 % 100);
  console.log(start24,startMins);
  var timeDiff = endMins - startMins;
  console.log(timeDiff);
  var startDiff = startMins - 540;
  var height = timeDiff * (5/9);
  console.log(height);
  var offset = (startDiff * (5/9)) + 70;
  $.each(days, function(index,val){
    var inner = '<div class="block-inner"><p class="class-title">'+name+'</p><p class="block-class-time">'+time+'</p></div>';
    var div = $('<div data-time="'+start24+'-'+end24+'" data-name="'+name+'">').html(inner).css({'width':'120px', 'height': height.toString()+'px','position':'absolute', 'top':offset.toString()+'px', 'border': 'solid 1px #A09B9B', 'background-color': colors[classNum]});
    div.addClass('block-class');
    $('#'+day_table[val]).append(div);
  });
  removeBlock();
  classNum += 1;
  showSchedule();
}

function checkScheduleSpace(start24,end24,days){
  var bool = true;
  $.each(days, function(index, val){
    $.each(Schedule[val], function(i,v){
      var start = v[0];
      var end = v[1];
      if ((start24 >= start) && (start24 <= end)){
        bool = false;
      }
    });
    if (bool){
   Schedule[val].push([start24,end24]);
  }
  });
  return bool;
}

function removeBlock(){
  $('.block-class').dblclick(function(event){
    var name = $(this).data('name');
    var time = $(this).data('time');
    console.log(name);
    $.each($('.day-column'), function(index,el){
      $.each($(el).children('.block-class'), function(i,val){
        if (name == $(val).data('name')){
          $(val).remove();
        }
      });
    });
    startTime = Number(time.split('-')[0]);
    var day_table={'M':'monday', 'T':'tuesday','W':'wednesday','R':'thursday','F':'friday'};
    $.each(Schedule, function(key,val){
      new_vals = [];
      $.each(val, function(index, v){
          if (v[0] != startTime)
          {
            new_vals.push(v);
          }
  });
      Schedule[key] = new_vals;
  });
    classNum -= 1;
  });
}

function get24(hours, minutes, post){
    var Hours = Number(hours);
    var Minutes = Number(minutes);
    var Post = post;
    var start24 = Hours * 100 + Minutes;
    if (Hours != 12 &&  Post == "PM"){
        start24 += 1200;
    }
    return start24;

}

var $form = $( "form" ).get(0);
$form.addEventListener('change', function(change){
   doQuery();
}, false);



$('#multi-select').multiSelect({
  afterSelect: function(values){
     doQuery();
  },
  afterDeselect: function(values){
     doQuery();
  }
});
});
