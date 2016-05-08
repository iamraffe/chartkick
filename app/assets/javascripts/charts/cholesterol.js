//= require graph.js

/*

  CHOLESTEROL GRAPH

*/

DVE.Graph.Cholesterol = function(graph){

  graph.threshold = {
    LDL: {over: 130, under: null},
    HDL: {over: null, under: 40},
    TRIGLYCERIDES: {over: 150, under: null},
    CHOLESTEROL: {over:  160, under: null}
  };

  graph.number_of_symbols = 4

  graph.color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);

  graph.data.entries = graph.data.entries.slice(-20)

  var entries = graph.data.entries;


  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  // console.log(dataNest[0].values[0].value)



  if(dataNest[0].values.length == 1){
    graph.single_point_data = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 130, 0, 40, 0, 150, 0, 160],
      [dataNest[0].values[0].value,
      (dataNest[0].values[0].value - 130) > -1 ? (dataNest[0].values[0].value - 130) : 0,
      dataNest[1].values[0].value,
      (dataNest[1].values[0].value - 40) > -1 ? (dataNest[1].values[0].value - 40) : 40,
      dataNest[2].values[0].value,
      (dataNest[2].values[0].value - 150) > -1 ? (dataNest[2].values[0].value - 150) : 0,
      dataNest[3].values[0].value,
      (dataNest[3].values[0].value - 160) > -1 ? (dataNest[3].values[0].value - 160) : 0,
      ]
    ]
    graph.draw_single_point();
    graph.draw_interventions();
  }
  else{
    graph.draw_interventions();

    graph.draw_multi();

    // graph.draw_dots();

    var hdl = dataNest[1].values[dataNest[1].values.length-1].value;

    var cholesterol = dataNest[3].values[dataNest[3].values.length-1].value;

    graph.percent = (cholesterol/hdl)/10;

    // console.log(graph.percent)

    graph.draw_gauge();

  }

};
