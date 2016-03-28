//= require graph.js

/*

  MERCURY GRAPH

*/

DVE.Graph.Mercury = function(graph){

  graph.threshold = {
    "MERCURY": {over: 11, under: null}
  };

  graph.number_of_symbols = 1

  graph.color = d3.scale.ordinal().range(['#4FCFEB', '#A725A7']);

  var entries = graph.data.entries;

  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  console.log(dataNest, dataNest[0].values);

  if(dataNest[0].values.length == 1){
    graph.single_point_data = [[0, 0], [0, 11],[graph.data.entries[0].value, (graph.data.entries[0].value - 11) > -1 ? (graph.data.entries[0].value - 11) : 11]]
    graph.draw_single_point();
  }
  else{
    // graph.draw_interventions();

    graph.draw_single();

    graph.draw_dots();
  }
};
