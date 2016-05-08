$(document).on("click", "#chart-with-patient", function () {
  $(".chart-with-patient").removeClass('hide');
});


$(document).on("click", ".chart-with-patient .fa-times", function () {
  // console.log("click")
  // $(this).css("display", "none");
  $(".chart-with-patient").addClass("hide");
  // $(this).siblings("section").css("display", "block")
});
