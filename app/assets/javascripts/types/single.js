/*

  SINGLELINE CHART

*/

DVE.Graph.prototype.draw_single = function () {
  var d = {};
  d.key = Object.keys(this.threshold)[0];


  this.yAxis = d3.svg.axis(this.y)
    // .subdivide(true)
    // .tickPadding(10)
    // .innerTickSize(-this.width)
    // .outerTickSize(0)
    .tickSize(-this.width)
    .orient("left")
    .scale(this.y);

    // console.log(this.date_axis)
  //   //
  this.date_axis = this.date_axis.slice(-5);

  this.xAxis = d3.svg.axis(this.x)
    // .subdivide(true)
    // .tickPadding(10)
    // .innerTickSize(-this.width)
    // .outerTickSize(0)
    .tickSize(0)
    .ticks(5)
    .tickValues(this.date_axis)
    .tickFormat(d3.time.format("%d/%b/%Y"))
    .orient("bottom")
    .scale(this.x);

    //  WE ONLY WANT THE LAST 5
    this.data.entries = this.data.entries.slice(-5);

    // console.log(this.data.entries)

      this.svg.append("clipPath")
            .attr("id", "clip-above")
            .append("rect")
              .attr("width", this.width)
              .attr("height", function(){
                if(this.threshold[d.key].over != null){
                  return this.y(this.threshold[d.key].over)
                }else{
                  return this.y(this.threshold[d.key].under)
                }
              }.bind(this));

      this.svg.append("clipPath")
            .attr("id", "clip-normal")
            .append("rect")
              .attr("y", function(){
                if(this.threshold[d.key].over != null){
                  return this.y(this.threshold[d.key].over)
                }else{
                  return this.height;
                }
              }.bind(this))
              .attr("width", this.width)
              .attr("height", function(){
                if(this.threshold[d.key].under != null){
                  return Math.abs(this.y(this.threshold[d.key].over) - this.y(this.threshold[d.key].under));
                }else{
                  return this.height - this.y(this.threshold[d.key].over);
                }
              }.bind(this));

      this.svg.append("clipPath")
          .attr("id", "clip-below")
          .append("rect")
            .attr("y", function(){
              if(this.threshold[d.key].under != null){
                return this.y(this.threshold[d.key].under)
              }else{
                return this.height;
              }
            }.bind(this))
            .attr("width", this.width)
            .attr("height", function(){
              if(this.threshold[d.key].under != null){
                return this.height - this.y(this.threshold[d.key].under);
              }else{
                return 0;
              }
            }.bind(this));

          this.svg.append("g")
            .classed("line", true)
          .selectAll("path")
            .data(["above", "normal", "below"])
          .enter().append("path")
            .attr("class", function(d) { return "path path--" + d; })
            .attr("clip-path", function(d) { return "url(#clip-" + d + ")"; })
            .datum(this.data.entries)
            .style('fill', 'none')
            .style("stroke-dasharray", function(obj, i){
              // console.log(this.threshold[d.key].over, i, this.threshold[d.key].over != null && i == 2)
              if((this.threshold[d.key].over != null && i == 0) || (this.threshold[d.key].under != null && i == 2)){
                return ("5, 5");
              }
              else{
                return ("0, 0");
              }
            }.bind(this))
            .style("stroke-width", function(obj, i){
              // console.log(this.threshold[d.key].over, i, this.threshold[d.key].over != null && i == 2)
              if((this.threshold[d.key].over != null && i == 0) || (this.threshold[d.key].under != null && i == 2)){
                return 1;
              }
              else{
                return 3;
              }
            }.bind(this))
            .attr("d", this.drawline)
            .attr('stroke', function(d,i){
              return this.color(d.symbol);
            }.bind(this));

// Add the X Axis
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (this.height+20) + ")")
        .call(this.xAxis);

    // Add the Y Axis
    this.svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis);

    this.svg.selectAll('.axis text')
    .style('fill', "#EBEBEB")
    .style('stroke-width', 0)
    .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');


 // now rotate text on x axis
        // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
        // first move the text left so no longer centered on the tick
        // then rotate up to get 45 degrees.
        this.svg.selectAll(".x.axis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
         })
          .style("fill", "black");

    this.svg.selectAll('.axis path')
        .style('stroke', "#EBEBEB")
        .style('fill', 'none')
        .style('stroke-width', 0);

    this.svg.selectAll('.axis line')
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 0.1);

var label = this.svg.selectAll(".label")
      .data(this.data.entries)
    .enter().append("g")
      .attr("class", function(d, i){
        return 'label dots tag'+ d.symbol.replace(/\s+/g, '')
      })
      .attr("transform", function(d, i) { return "translate(" + this.x(d.date) + "," + this.y(d.value) + ")"; }.bind(this));

  label.append("text")
      .attr("class", "text-values")
      .attr("dy", ".35em")
      .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
      .style("font-weight", "bold")
      .style("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("id", function(d,i){
        return 'val'+d.symbol.replace(/\s+/g, '')+i;
      })
      .text(function(d) { return d.value; })
    .filter(function(d, i) { return i === 0 })
    .append("tspan")
      .attr("class", "label-key")
      .attr("x", -35)
      .style("font-size", 12)
      .text(function(d) { return " " + d.symbol; });

  label.append("rect")
      .datum(function() {
        // console.log(this, this.nextSibling, this.previousSibling)
        return this.previousSibling.getBBox();
      })
      .attr("fill", "white")
      .attr("x", function(d) { return d.x - 3; })
      .attr("y", function(d) { return d.y - 3; })
      .attr("width", function(d) { return d.width + 2 * 3; })
      .attr("height", function(d) { return d.height + 2 * 3; });
  label.append("text")
      .attr("class", "text-values")
      .attr("dy", ".35em")
      .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
      .style("font-weight", "bold")
      .style("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("id", function(d,i){
        return 'val'+d.symbol.replace(/\s+/g, '')+i;
      })
      .text(function(d) { return d.value; })
    .filter(function(d, i) { return i === 0 })
    .append("tspan")
      .attr("class", "label-key")
      .attr("x", -35)
      .style("font-size", 12)
      .text(function(d) { return " " + d.symbol; });
    // Add the text
    // this.svg.selectAll('.text-values')
    //     .data(this.data.entries)
    //     .enter()
    //     .append("text")
    //     .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
    //     .style("font-weight", "bold")
    //     .style("font-size", 10)
    //     .attr("id", function(d,i){
    //       return 'val'+d.symbol.replace(/\s+/g, '')+i;
    //     })
    //     .attr('class', function(d,i){
    //       return 'text-values tag'+d.symbol.replace(/\s+/g, '');
    //     })
    //     // .attr('class', 'text-values')
    //     .attr("transform", function(d) {
    //       return "translate("+(this.x(d.date))+","+(this.y(d.value))+")";
    //     }.bind(this))
    //     .text(function(d){
    //       return d.value;
    //     })
    //     .style("fill", function(d) { // Add the colours dynamically
    //         return this.color(d.symbol);
    //     }.bind(this));

};
