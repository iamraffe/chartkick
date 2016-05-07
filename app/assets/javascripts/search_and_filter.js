$(document).on("click", "#filter-toggler", function () {
  console.log("clicked");
  $("#filter-widget").slideToggle();
  $('#chart-filter').selectpicker({
    style: 'btn-slim btn-light',
    size: 4
  });
  $('#patient-sorting').selectpicker({
    style: 'btn-slim btn-light',
    size: 4
  });
});

$(document).on("change", "#chart-filter, #patient-sorting", function(){
  var chart_filter = $("#chart-filter").val();
  var order_by = $("#patient-sorting").val();
  // "/users/autocomplete_user_full_name?term=ku"
  $.ajax({
    type: "GET",
    // contentType: "application/json; charset=utf-8",
    data: {filters: {charts: chart_filter, order_by: order_by}},
    url: "/users/autocomplete_user_full_name",
    // dataType: 'json',
    success: function (data) {
      console.log(data)
      $(".my-patients").html("");
      data.forEach(function(d,i){
        patient = "<li class='patient'>"
        patient +=  "<a href='/users/"+d.id+"' class='btn-link'>"
        patient +=    "<img src='"+d.avatar+"' alt='"+d.value+"' class='img-circle' style=''>"
        patient +=    "<span class='patient-name'>"+d.last_name+", "+d.first_name+"</span>"
        patient +=   "</a>"
        patient += "</li>"
        $(".my-patients").append(patient);
      });
    },
    error: function (result) {
       error();
    }
  });
})
