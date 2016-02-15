if (window.DVE === undefined) {
  window.DVE = {};
}

DVE.init = function () {
  console.log("DVE ONLINE!");
  this.graph_wrapper = $("#graph");
  if(this.graph_wrapper.length){
    this.graph_type = this.graph_wrapper.parent().data("type");
    // console.log(this.graph_type);
    console.log("A GRAPH SHOULD BE DISPLAYED HERE");
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/chart-session',
      dataType: 'json',
      success: function (data) {
        new DVE.Graph(data, this.graph_type).render();
      }.bind(this),
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
  DVE.init();
});