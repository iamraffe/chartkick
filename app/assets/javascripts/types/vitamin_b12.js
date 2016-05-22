//= require graph.js

/*

  VITAMIN B12 GRAPH

*/

DVE.Graph.VitaminB12 = function(graph){

  graph.threshold = {
    "VITAMIN B12": {over: 900, under: 200}
  };

  graph.number_of_symbols = 1

  graph.color = d3.scale.ordinal().range(['#383F47', '#F1CC28', '#B35252', '#63B28F']);

  graph.data.entries = graph.data.entries.slice(-5)

  var entries = graph.data.entries;

  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  console.log(dataNest, dataNest[0].values);

  if(dataNest[0].values.length == 1){
    graph.single_point_data = [[0, 200], [0, 900],[graph.data.entries[0].value, (graph.data.entries[0].value - 900) > -1 ? (graph.data.entries[0].value - 900) : 900]]
    graph.draw_single_point();
    graph.draw_interventions();
  }
  else{
    graph.draw_interventions();

    graph.draw_single();

    graph.draw_dots();
  }
};
