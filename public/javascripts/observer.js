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
          var insert = '<li class="res"><p>' + row.name +' - '+ row.number +'    |       Days: '+days+'      |      Times: '+row.times+'</p><p> Instructor: '+row.instructor +'</p><a href='+row.link+' target="_blank">Course Details</a>' +
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
});


function addClick(){
$("span.add").on('click',function(){
  console.log("clicked");
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
  if (checkScheduleSpace(start24,end24,days) === false){
    alert("Time slot " + days.toString()+' '+'from '+time+' already filled');
    return;
  }
  var timeDiff = end24 - start24;
  var startDiff = start24 - 900;
  var height = (timeDiff/1100) * 350;
  var offest = ((startDiff/1100) * 350) + 60;
  $.each(days, function(index,val){
    var inner = '<p class="class-title">'+name+'</p><p class="block-class-time">'+time+'</p>';
    var div = $("<div>").html(inner).css({'width':'120px', 'height': height.toString()+'px','position':'absolute', 'top':offest.toString()+'px', 'border': 'solid 1px black'});
    div.addClass('block-class');
    $('#'+day_table[val]).append(div);
    removeBlock();
  });
  showSchedule();
}

function checkScheduleSpace(start24,end24,days){
  var bool = true;
  $.each(days, function(index, val){
    var slots = Schedule[val];
    console.log(slots);
    $.each(slots, function(i,v){
      var start = v[0];
      var end = v[1];
      console.log(start,start24);
      console.log(end,end24);
      if ((start24 >= start) && (end24 <= end)){
        console.log("Break");
        bool = false;
      }
    });
   Schedule[val].push([start24,end24]);
  });
  return bool;
}

function removeBlock(){
  $('.block-class').dblclick(function(event){
    $(this).remove();
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
