/*

  SINGLELINE CHART

*/

DVE.Graph.prototype.draw_single_point = function () {
  console.log("DRAWING SINGLE POINT");

  // graph.threshold = {
  //   LDL: {over: true, value: 130},
  //   HDL: {over: false, value: 40},
  //   TRIGLYCERIDES: {over: true, value: 150},
  //   CHOLESTEROL: {over: true, value: 160}
  // };

  // this.data.entries

  // data.forEach(function(d) {
  //   var y0 = 0;
  //   d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
  //   d.total = d.ages[d.ages.length - 1].y1;
  // });

  // var x1 = d3.scale.ordinal();

  // var yBegin;

  // var innerColumns = {
  //   "value" : ["Under 5 Years","5 to 13 Years","14 to 17 Years"],
  //   "threshold" : ["18 to 24 Years"],
  // }

  this.y = d3.scale.ordinal()
    .rangeRoundBands([0, this.height], 0.05);

  this.x = d3.scale.linear()
    .range([0, this.width]);

  this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

  console.log(this.data.entries)

  this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

  this.y.domain(this.data.entries.map(function(d) { return d.symbol; }));

  this.x.domain([0, d3.max([d3.max(this.data.entries, function(d) { return d.value; }), 240])]);

  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);

  this.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis).selectAll("text")
    .attr("y", 15)
    // .attr("x", 0)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "middle");

  this.svg.selectAll(".bar")
      .data(this.data.entries)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("y", function(d) { return this.y(d.symbol); }.bind(this))
      .attr("height", this.y.rangeBand()/2)
      // .attr("x", function(d) { return 0 }.bind(this))
      .style("fill", function(d) { // Add the colours dynamically
        return this.color(d.symbol);
      }.bind(this))
      .attr("width", function(d) { return this.width - this.x(d.value); }.bind(this));

      // console.log(this.svg.selectAll("g"));

    // this.svg.select("g").attr("transform",
    //               "translate(" + this.margin.left + "," + 150 + ")");

    this.svg.append("text")
        .attr("transform", "translate(" + (this.width / 2) + " ," + (0) + ")")
        .style("text-anchor", "middle")
        .text("("+this.data.entries[0].date.toLocaleDateString()+")");
};
