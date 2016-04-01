//= require graph.js

/*

  Ferritin GRAPH

*/

DVE.Graph.Ferritin = function(graph){

  graph.threshold = {
    "FERRITIN": {over: 154, under: 30}
  };

  graph.number_of_symbols = 1

  graph.color = d3.scale.ordinal().range(['#4FCFEB', '#A725A7']);

  var entries = graph.data.entries;

  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  console.log(dataNest, dataNest[0].values);

  if(dataNest[0].values.length == 1){
    graph.single_point_data = [[0, 30], [0, 154],[graph.data.entries[0].value, (graph.data.entries[0].value - 154) > -1 ? (graph.data.entries[0].value - 154) : 154]]
    graph.draw_single_point();
  }
  else{
    graph.draw_interventions();

    graph.draw_single();

    graph.draw_dots();
  }
};
