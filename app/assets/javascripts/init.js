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

    this.keys = this.graph_wrapper.parent().data("keys");

    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: "/"+this.url,
      dataType: 'json',
      success: function (data) {
        DVE.current_graph = new DVE.Graph(data, this.graph_type);
        DVE.current_graph.render();
        d3.select("#export")
          .on("click", DVE.current_graph.export);
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

String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
