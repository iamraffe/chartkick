$(document).on("click", "#chart-with-patient", function () {
  $(".chart-with-patient").removeClass('hide');
});


$(document).on("click", ".chart-with-patient .fa-times", function () {
  $(".chart-with-patient").addClass("hide");
});

$(document).on("change", "#user-teams", function(){
  var id = $(this).val();
  $('ul.user-team').each(function(){$(this).addClass('hide');})
  $('ul#'+id).removeClass('hide');
});


$(document).on('click','.dropdown-menu', function(e) {
  e.stopPropagation();
});


$(document).on('click','.switch', function(e) {
  console.log("clicked here")
  // $(this).children(".switch-label").attr("data-on", "1");
  $('#vacation-dates').toggleClass('hide');
  return false;
});
