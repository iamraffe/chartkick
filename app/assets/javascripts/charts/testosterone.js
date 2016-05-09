//= require graph.js

/*

  TESTOSTERONE GRAPH

*/

DVE.Graph.Testosterone = function(graph){

  graph.threshold = {
    "TESTOSTERONE": {over: 1100, under: 250}
  };

  graph.number_of_symbols = 1

  graph.color = d3.scale.ordinal().range(['#383F47', '#F1CC28', '#B35252', '#63B28F']);

  var entries = graph.data.entries;

  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  console.log(dataNest, dataNest[0].values);

  if(dataNest[0].values.length == 1){
    graph.single_point_data = [[0, 250], [0, 1100],[graph.data.entries[0].value, (graph.data.entries[0].value - 1100) > -1 ? (graph.data.entries[0].value - 1100) : 1100]]
    graph.draw_single_point();
    graph.draw_interventions();
  }
  else{
    graph.draw_interventions();

    graph.draw_single();

    graph.draw_dots();
  }
};
