if (window.DVE === undefined) {
  window.DVE = {};
}

DVE.init = function () {
  console.log("DVE ONLINE!");
  this.graph_wrapper = $("#graph");
  if(this.graph_wrapper.length){
    console.log("A GRAPH SHOULD BE DISPLAYED HERE");
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/chart-session',
      dataType: 'json',
      success: function (data) {
        new DVE.Graph(data);
      },
      error: function (result) {
         error();
      }
    });
  }
  else{
    console.log("NO GRAPH HERE MOVE ALONG");
  }
};

$(document).on("ready", function () {
  // DVE.init();
});