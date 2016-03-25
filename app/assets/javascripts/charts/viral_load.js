//= require graph.js

/*

  VIRAL LOAD GRAPH

*/

DVE.Graph.ViralLoad = function(graph){

  graph.threshold = {
    "Viral Load": {over: 900, under: 200}
  };

  graph.number_of_symbols = 1

  graph.color = d3.scale.ordinal().range(['#4FCFEB', '#A725A7']);

  var entries = graph.data.entries;

  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  console.log(dataNest, dataNest[0].values);

  if(dataNest[0].values.length == 1){
    graph.draw_single_point();
  }
  else{
    // graph.draw_interventions();

    graph.draw_single();

    graph.draw_dots();
  }
};
