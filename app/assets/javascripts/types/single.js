/*

  SINGLELINE CHART

*/

DVE.Graph.prototype.draw_single = function () {
  var d = {};
  // console.log(this.threshold, Object.keys(this.threshold))
  d.key = Object.keys(this.threshold)[0];
  // console.log("DRAWING SINGLE LINE");
  // var margin = {top: 30, right: 20, bottom: 70, left: 50},
  //     width = 768 - margin.left - margin.right,
  //     height = 500 - margin.top - margin.bottom;

  // var parseDate = d3.time.format("%b %Y").parse;

  // var th =d3.scale.ordinal().range([130, 40, 150, 160]);
  // var thd =d3.scale.ordinal().domain([130, 40, 150, 160]);

  // var x = d3.time.scale().range([0, width]);
  // var y = d3.scale.linear().range([height, 0]);

  // var xAxis = d3.svg.axis().scale(x)
  //     .tickFormat(d3.time.format("%m/%y"))
  //     .orient("bottom");

  // var yAxis = d3.svg.axis().scale(y)
  //   .ticks(data.entries.length/4)
  //   .orient("left");

  // var priceline = d3.svg.line()
  //     .x(function(d) { return x(d.date); })
  //     .y(function(d) { return y(d.value); });

  // var svg = d3.select("#graph")
  //     .append("svg")
  //         .attr("class", "chart")
  //         .attr("width", 775)
  //         .attr("height", height + margin.top + margin.bottom)
  //         .append("g")
  //           .attr("transform",
  //                 "translate(" + margin.left + "," + margin.top + ")");

    //  WE ONLY WANT THE LAST 5
    this.data.entries = this.data.entries.slice(-5);

    // var color = d3.scale.ordinal().range(['#4FCFEB', '#A725A7']);


    // this.data.entries.forEach(function(d) {
    //   d.date = parseDate(d.date);
    //   d.value = +d.value;
    // });

    // var minDate = new Date(data.entries[0].date.getFullYear()-1, data.entries[0].date.getMonth()+1,data.entries[0].date.getDate());
    // var maxDate = new Date(data.entries[data.entries.length - 1].date.getFullYear()+1, data.entries[data.entries.length - 1].date.getMonth()+1,data.entries[data.entries.length - 1].date.getDate());

    // x.domain([minDate, maxDate]);
    // y.domain([d3.min(data.entries, function(d) { return d.value; })-75, d3.max(data.entries, function(d) { return d.value; })+75]);



        // this.svg.append("clipPath")
        //       .attr("id", "clip-above")
        //     .append("rect")
        //       .attr("width", this.width)
        //       .attr("height", this.y(55));

        //   this.svg.append("clipPath")
        //       .attr("id", "clip-below")
        //     .append("rect")
        //       .attr("y", this.y(55))
        //       .attr("width", this.width)
        //       .attr("height", this.height - this.y(55));

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
            .data(["above", "below"])
          .enter().append("path")
            .attr("class", function(d) { return "path path--" + d; })
            .attr("clip-path", function(d) { return "url(#clip-" + d + ")"; })
            .datum(this.data.entries)
            .style('fill', 'none')
            .style("stroke-dasharray", function(obj, i){
              if((this.threshold[d.key].over != null && i == 1) || (this.threshold[d.key].under != null && i == 0)){
                return ("5, 5");
              }
              else{
                return ("0, 0");
              }
            }.bind(this))
            .attr("d", this.drawline)
            .attr('stroke', function(d,i){
              return this.color(d.symbol);
            }.bind(this));

// Add the X Axis
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis);

    // Add the Y Axis
    this.svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis);

    this.svg.selectAll('.axis text')
    .style('fill', 'black')
    .style('stroke-width', 0)
    .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');

    this.svg.selectAll('.axis path')
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 2);

    // svg.selectAll('.tick line').style('fill', 'black');

    // // Add the dots
    // svg.selectAll('.dots')
    //     .data(data.entries)
    //     .enter()
    //     .append("g")
    //     .attr("class", function(d, i){
    //       return 'dots tag'+ d.symbol.replace(/\s+/g, '')
    //     })
    //     .attr('clip-path', "url(#clip)")
    //     .append('circle')
    //     .attr("r", 5)
    //     .attr('fill', function(d,i){
    //       return d.color = color(d.symbol);
    //     })
    //     .attr('stroke', function(d,i){
    //       return color(d.symbol);
    //     })
    //     .attr("transform", function(d) {
    //       return "translate("+x(d.date)+","+y(d.value)+")";
    //     });
    // Add the text
    this.svg.selectAll('.text-values')
        .data(this.data.entries)
        .enter()
        .append("text")
        .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
        .style("font-weight", "bold")
        .style("font-size", 10)
        .attr("id", function(d,i){
          return 'val'+d.symbol.replace(/\s+/g, '')+i;
        })
        .attr('class', function(d,i){
          return 'text-values tag'+d.symbol.replace(/\s+/g, '');
        })
        // .attr('class', 'text-values')
        .attr("transform", function(d) {
          if(d.symbol === 'HDL' || d.symbol === 'LDL'){
            return "translate("+(this.x(d.date)-7.5)+","+(this.y(d.value)+20)+")";
          }
          else{
            return "translate("+(this.x(d.date)-7.5)+","+(this.y(d.value)-10)+")";
          }
        }.bind(this))
        .text(function(d){
          return d.value;
        })
        .style("fill", function(d) { // Add the colours dynamically
            return this.color(d.symbol);
        }.bind(this));

};
