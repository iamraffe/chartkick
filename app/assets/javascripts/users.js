$(document).on("click", "#chart-with-patient", function () {
  $(".chart-with-patient").removeClass('hide');
});


$(document).on("click", ".chart-with-patient .fa-times", function () {
  // console.log("click")
  // $(this).css("display", "none");
  $(".chart-with-patient").addClass("hide");
  // $(this).siblings("section").css("display", "block")
});


$(document).on("page:change", function () {
  // $(this).siblings("#filter-widget").slideToggle();
  $('#user-settings').selectpicker({
    style: 'btn-slim btn-light btn-block',
    size: 4
  });
});
