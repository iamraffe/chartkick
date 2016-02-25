//= require graph.js

/*

  CHOLESTEROL GRAPH

*/

DVE.Graph.Cholesterol = function(graph){

  graph.threshold = {
    LDL: {over: true, value: 130},
    HDL: {over: false, value: 40},
    TRIGLYCERIDES: {over: true, value: 150},
    CHOLESTEROL: {over: true, value: 160}
  };

  graph.number_of_symbols = 4

  graph.color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);

  graph.draw_interventions();

  graph.draw_multi();

  graph.draw_dots();

  var entries = graph.data.entries;

  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  var hdl = dataNest[1].values[dataNest[1].values.length-1].value;

  var cholesterol = dataNest[3].values[dataNest[3].values.length-1].value;

  graph.percent = (cholesterol/hdl)/10;

  graph.draw_gauge();
  
};
