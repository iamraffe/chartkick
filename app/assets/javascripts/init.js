/*

  INIT FILE FOR DATA VISUALIZATION ENGINE

*/

if (window.DVE === undefined) {
  window.DVE = {};
}

DVE.init = function () {
  this.graph_wrapper = $("#graph");
  if(this.graph_wrapper.length){
    this.graph_type = this.graph_wrapper.parent().data("type");
    this.url = this.graph_wrapper.parent().data("url");
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: "/"+this.url,
      dataType: 'json',
      success: function (data) {
        new DVE.Graph(data, this.graph_type).render();
      }.bind(this),
      error: function (result) {
         error();
      }
    });
  }
};

$(document).on("page:change", function () {
  DVE.init();
});