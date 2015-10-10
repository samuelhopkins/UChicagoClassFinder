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
    $("ul.classes").empty();
    $.get("/up", $state.state, function(data){
        data = JSON.parse(data);
        for(var d in data){
          var row =  data[d];
          var insert = '</li><p> ' + row.name +' '+ row.number +' '+row.days+' '+row.times+'<p></li>';
          $("ul.classes").append(insert);
        }
      });
}, false);
});