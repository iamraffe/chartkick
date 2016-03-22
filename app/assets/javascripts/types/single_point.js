/*

  SINGLELINE CHART

*/

DVE.Graph.prototype.draw_single_point = function () {
  console.log("DRAWING SINGLE POINT");
  this.x = d3.scale.ordinal()
    .rangeRoundBands([0, this.width], .1);
  this.y = d3.scale.linear()
    .range([this.height, 0]);
  this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

  console.log(this.data.entries)

  this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

  this.x.domain(this.data.entries.map(function(d) { return d.symbol; }));
  this.y.domain([0, d3.max(this.data.entries, function(d) { return d.value; })]);

  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);

  this.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value");

  this.svg.selectAll(".bar")
      .data(this.data.entries)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return this.x(d.symbol); }.bind(this))
      .attr("width", this.x.rangeBand())
      .attr("y", function(d) { return this.y(d.value); }.bind(this))
      .attr("height", function(d) { return this.height - this.y(d.value); }.bind(this));
};
