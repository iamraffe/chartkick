$.ajax({
           type: "GET",
           contentType: "application/json; charset=utf-8",
           url: '/',
           dataType: 'json',
           success: function (data) {
               drawMultiLine(data);
           },
           error: function (result) {
               error();
           }
       });

function draw(data) {
    var color = d3.scale.category20b();
    console.log(color);
    var width = 420,
        barHeight = 20;

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data)]);

    var chart = d3.select("#graph")
        .attr("width", width)
        .attr("height", barHeight * data.length);

    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function (d, i) {
                  return "translate(0," + i * barHeight + ")";
              });

    bar.append("rect")
        .attr("width", x)
        .attr("height", barHeight - 1)
        .style("fill", function (d) {
                   return color(d)
               })

    bar.append("text")
        .attr("x", function (d) {
                  return x(d) - 10;
              })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .style("fill", "white")
        .text(function (d) {
                  return d;
              });
}

function drawMultiLine(data) {
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 768 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var interventionLine = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("basis");

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .ticks(data.length/4)
    .tickFormat(d3.time.format("%b %Y"))
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
  // .tickPadding(10)
  .ticks(data.length/4)
  // .tickSize(-width)
  // .tickSubdivide(true)
    .orient("left");

// Define the line
var priceline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

// Adds the svg canvas
var svg = d3.select("#graph-container")
    .append("svg")
    .attr("class", "chart")
        .attr("width", '100%')
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })+75]);

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(data);

    var color = d3.scale.category20();   // set the colour scale

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) {

        svg.append("path")
            .attr("class", "line")
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline(d.values))
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .on("click", function(){
              // Determine if current line is visible
                var active   = d.active ? false : true;
                newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                d3.selectAll(".tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements
                d.active = active;
            });

        // Add the Legend
        svg.append("text")
            .attr("x", width + margin.left + 50)  // space legend
            .attr("y", 100 + i * (margin.bottom/2)+ 5)
            .attr("class", "legend")    // style the legend
            .style("fill", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .on("click", function(){
                // Determine if current line is visible
                var active   = d.active ? false : true;
                newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                d3.selectAll(".tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;
            })
            .text(d.key);

    });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add the dots
    svg.selectAll('.dots')
        .data(data)
        .enter()
        .append("g")
        .attr("class", function(d, i){
          return 'dots tag'+ d.symbol.replace(/\s+/g, '')
        })
        .attr('clip-path', "url(#clip)")
        .append('circle')
        .attr("r", 2.5)
        .attr('fill', function(d,i){
          return d.color = color(d.symbol);
        })
        .attr("transform", function(d) {
          return "translate("+x(d.date)+","+y(d.value)+")";
        });

    svg.selectAll('.chart')
      .data(data)
      .enter()
      .append('rect')
      .style("opacity", 0.1)
      .attr('width', function(d,i){
        if(i%(data.length/4) != 4 && d.overlay){
          console.log(x(data[i+1].date)-x(d.date));
          return parseInt(x(data[i+1].date)-x(d.date));
        }
        else{
          return 0;
        }
      })
      .attr('x', function(d) {
          return x(d.date)+10;
        })
      .attr('height', function(d) {
        return height
      })
      .attr("class", function(d){
        return d.overlay ? "interventions" : "hide";
      })
      .attr("fill", function(d){
          return color(d.value);
      });

      // svg.append("path")
      //     .attr("class", "line")
      //     .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
      //     .attr("d", priceline(d.values))
      //     .style("stroke", function() { // Add the colours dynamically
      //         return d.color = color(d.key); })
      //     .on("click", function(){
      //       // Determine if current line is visible
      //         var active   = d.active ? false : true;
      //         newOpacity = active ? 0 : 1;
      //         // Hide or show the elements based on the ID
      //         d3.select("#tag"+d.key.replace(/\s+/g, ''))
      //             .transition().duration(100)
      //             .style("opacity", newOpacity);
      //         d3.selectAll(".tag"+d.key.replace(/\s+/g, ''))
      //             .transition().duration(100)
      //             .style("opacity", newOpacity);
      //         // Update whether or not the elements
      //         d.active = active;
      //     });

    // svg.selectAll('.chart')
    //   .data(data)
    //   .enter()
    //   .append('path')
    //   .style("opacity", 0.15)
    //   .attr("d", interventionLine([(0.0),(1,1)]))
    //   // .attr('width', 1)
    //   // .attr('x', function(d) {
    //   //     return x(d.date)+10;
    //   // })
    //   // .attr('y', 0)
    //   // .attr('height', function(d) {
    //   //   return height
    //   // })
    //   .attr("class", function(d){
    //     return d.overlay ? "interventions-frame" : "hide";
    //   })
    //   .strike("stroke", function(d){
    //       return color(d.value);
    //   });


}

function error() {
    console.log("error")
}
