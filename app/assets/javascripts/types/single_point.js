/*

  SINGLELINE CHART

*/

DVE.Graph.prototype.draw_single_point = function () {
  console.log("DRAWING SINGLE POINT");
      

  // var chartVariant = ["stack", "group"];
  // var variant = 0; // Change the chart type here (0, 1)
  // var offsetVariants = ["zero", "expand", "silhouette", "wiggle"];
  // var offset = 0; // Change the stacked bar chart offset type here (0-3)

  var data = [[0, 60],[this.data.entries[0].value, 120]],
  margin = [10, 10, 10, 10],
  gap = 10;



  this.dataForStack = data.map(function(d, i){return d.map(function(d2, i2){return {x: i2, y: d2};});});
  this.stackedData = d3.layout.stack().offset("zero")(this.dataForStack);

  this.stackedDataTransposed = d3.transpose(this.stackedData);

  var max = d3.max(this.stackedDataTransposed.map(function(d, i){
      return d3.sum(d.map(function(d, i){return d.y;}));
  }.bind(this)));

  // console.log(this.data.entries.map(function(d){
  //   return d.symbol;
  // }));

  // console.log(d3.keys(this.data.entries.map(function(d){
  //   return d.symbol;
  // })));

  this.keys = this.data.entries.map(function(d){
    return d.symbol;
  })

  this.keys.push("Control");

  this.x = d3.scale.linear().domain([0, max]).range([0, this.width]);
  this.y = d3.scale.ordinal().domain(d3.range(this.keys.length)).rangeBands([0, this.height]);

var barChart = computeStackedBarchart(this.height, this.width, margin, gap, this.x, this.y);

var groups = this.svg.selectAll("g")
                        .data(this.stackedDataTransposed)
                        .enter().append("g")
                        .attr("transform", function(d, i){return "translate(0, "+(i*this.y.rangeBand())+")";}.bind(this));

groups.selectAll("rect")
    .data(function(d){return d;})
    .enter().append("rect")
    .attr("width", barChart.h)
    .attr("height", barChart.w)
    .attr("x", barChart.y)
    .style("fill", function(d) { 
      return this.color(d.symbol);
    }.bind(this))
    .style("stroke", "red")
    .attr("y", barChart.x);

/*===========================================================*/

function computeStackedBarchart(chartW, chartH, margin, gap, scaleY, scaleX){
    var gapW = scaleX.rangeBand()*(gap/100);

    var markX = function(d, i){
      return (scaleX.rangeBand()/3);
    };
    var markY = function(d, i){
      return scaleY(d.y0);
    };
    var markW = function(d, i){
      // console.log(chartW - scaleX.rangeBand()-gapW)
      return (scaleX.rangeBand()/2)-gapW;
    };
    var markH = function(d, i){
      // console.log(scaleY(d.y))
      return scaleY(d.y);
    };
    return {x: markX, y: markY, w: markW, h: markH};
}


    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .tickFormat(function(d,i) { return this.keys[i] }.bind(this))
      .orient("left");
      // .selectAll("text")  
      //       .style("text-anchor", "end")
      //       .attr("dx", "-.8em")
      //       .attr("dy", ".15em")
      //       .attr("transform", "rotate(90)" );

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis);

    this.svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis);

    this.svg.append("text")
        .attr("transform", "translate(" + (this.width / 2) + " ," + (0) + ")")
        .style("text-anchor", "middle")
        .text("("+this.data.entries[0].date.toLocaleDateString()+")");
};
