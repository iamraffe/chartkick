$(document).on('ready page:change turbolinks:load', function(){
  var title = document.title;
  setInterval(check_for_notifications, 2000)

  function check_for_notifications() {
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: "/notifications",
      dataType: 'json',
      success: function (data) {
        if(data.length > 0){
          document.title = '(' + data.length + ') ' + title;
        }
        else{
          document.title = title;
        }
      },
      error: function (result) {
        console.log("Error")
      }
    });
  }
})
