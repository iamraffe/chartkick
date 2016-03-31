//= require graph.js

/*

  LONG POLLING FOR INTERVENTIONS

*/

DVE.Graph.prototype.watch_interventions = function () {

  // var that = this;

  $.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    url: '/interventions',
    dataType: 'json',
    success: function (interventions) {
      // console.log(interventions, this, that)
      this.update_sidebar(interventions)
    }.bind(this),
    error: function (result) {
       error();
    }
  });

}