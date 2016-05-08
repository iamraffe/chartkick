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

$(document).on("change", "#filter-widget", function(){
  var chart_filter = $("#chart-filter").val();
  var order_by = $("#patient-sorting").val();
  var my_patients = $('input[name="my-patients"]').is(':checked');
  var naturopathic = $('input[name="naturopathic"]').is(':checked');
  var gender = [];
  $('input[name="male"]').is(':checked') ? gender.push("M") : '';
  $('input[name="female"]').is(':checked') ? gender.push("F") : '';

  if(gender.length == 0){
    gender = ["M", "F"]
  }

  var age;

  age = $('input[name="pediatric"]').is(':checked') == false && $('input[name="adult"]').is(':checked')  ? 18 : 0;

  // console.log(gender);
  // "/users/autocomplete_user_full_name?term=ku"
  $.ajax({
    type: "GET",
    // contentType: "application/json; charset=utf-8",
    data: {filters: {charts: chart_filter, order_by: order_by, my_patients: my_patients, gender: gender, age: age, naturopathic: naturopathic}},
    url: "/users/autocomplete_user_full_name",
    beforeSend: function() {
      $('.my-patients').addClass('hide');
      $('.loader-wrapper').removeClass('hide');
      $(".my-patients").html("");
    },
    // dataType: 'json',
    success: function (data) {
      console.log(data)
      $('.my-patients').removeClass('hide');
      $('.loader-wrapper').addClass('hide');
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
