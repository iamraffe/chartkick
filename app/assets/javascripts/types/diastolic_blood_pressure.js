//= require graph.js

/*

  DIASTOLIC BLOOD PRESSURE GRAPH

*/

DVE.Graph.DiastolicBloodPressure = function(graph){

  graph.threshold = {
    "DIASTOLIC BLOOD PRESSURE": {over: 80, under: null}
  };

  graph.number_of_symbols = 1

  graph.color = d3.scale.ordinal().range(['#383F47', '#F1CC28', '#B35252', '#63B28F']);

  var entries = graph.data.entries;

  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  console.log(dataNest, dataNest[0].values);

  if(dataNest[0].values.length == 1){
    graph.single_point_data = [[0, 0], [0, 80],[graph.data.entries[0].value, (graph.data.entries[0].value - 80) > -1 ? (graph.data.entries[0].value - 80) : 80]]
    graph.draw_single_point();
    graph.draw_interventions();
  }
  else{
    graph.draw_interventions();

    graph.draw_single();

    graph.draw_dots();
  }
};
