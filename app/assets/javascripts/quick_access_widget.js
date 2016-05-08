$(document).on("click", ".quick-access-icon", function () {
  console.log("click")
  $(".quick-access-container > section, .quick-access-container > .fa-times").css("display", "none");
  $(this).siblings("section, .fa-times").css("display", "block")
});


$(document).on("click", ".quick-access-container .fa-times", function () {
  console.log("click")
  $(this).css("display", "none");
  $(".quick-access-container > section").css("display", "none");
  // $(this).siblings("section").css("display", "block")
});
