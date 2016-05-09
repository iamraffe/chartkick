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


$('.dropdown-menu').on('click', function(e) {
  e.stopPropagation();
});


