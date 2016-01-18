$(document).ready(function(e){
  if($('#session-graph-container').length > 0){
    drawGraphFromSession();
  }
});

$(document).ready(function(e){
  // console.log(document.URL.split("/").pop());
  if($('#db-graph-container').length > 0){
    var id = document.URL.split("/").pop();
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/charts/cholesterol/'+id,
      dataType: 'json',
      success: function (data) {
        // console.log(data, id);
        drawMultiLine(data);
      },
      error: function (result) {
         error();
      }
    });
  }
});


  function drawGraphFromSession(){
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/cholesterol-session',
      dataType: 'json',
      success: function (data) {
        // console.log(data);
        drawMultiLine({entries: data.entries, interventions: [data.intervention]});
      },
      error: function (result) {
         error();
      }
    });
  }


// function draw(data) {
//     var color = d3.scale.category20b();
//     console.log(color);
//     var width = 420,
//         barHeight = 20;

//     var x = d3.scale.linear()
//         .range([0, width])
//         .domain([0, d3.max(data)]);

//     var chart = d3.select("#graph")
//         .attr("width", width)
//         .attr("height", barHeight * data.length);

//     var bar = chart.selectAll("g")
//         .data(data)
//         .enter().append("g")
//         .attr("transform", function (d, i) {
//                   return "translate(0," + i * barHeight + ")";
//               });

//     bar.append("rect")
//         .attr("width", x)
//         .attr("height", barHeight - 1)
//         .style("fill", function (d) {
//                    return color(d)
//                })

//     bar.append("text")
//         .attr("x", function (d) {
//                   return x(d) - 10;
//               })
//         .attr("y", barHeight / 2)
//         .attr("dy", ".35em")
//         .style("fill", "white")
//         .text(function (d) {
//           return d;
//         });
// }

function drawMultiLine(data) {
// console.log("call");
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 768 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse;



// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    // .ticks(data.entries.length/4)
    .tickFormat(d3.time.format("%m/%y"))
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
  // .tickPadding(10)
  .ticks(data.entries.length/4)
  // .tickSize(-width)
  // .tickSubdivide(true)
    .orient("left");

// Define the line
var priceline = d3.svg.line()
    .x(function(d) {
      console.log(d);
      return x(d.date);
    })
    .y(function(d) { return y(d.value); });

// Adds the svg canvas
var svg = d3.select("#graph")
    .append("svg")
    .attr("class", "chart")
        .attr("width", 925)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    data.entries.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });



    // Scale the range of the data
    x.domain(d3.extent(data.entries, function(d) { return d.date; }));
    y.domain([0, d3.max(data.entries, function(d) { return d.value; })+75]);

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(data.entries);

    var color = d3.scale.category20();   // set the colour scale

    console.log(dataNest.length);

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
        .data(data.entries)
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


/*
INTERVENTIONS

 */

    if(data.interventions.length>0){
      var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;
      data.interventions.forEach(function(d) {
        d.start = parseInterventionDate(d.start);
        d.end = parseInterventionDate(d.end);
        d.title = d.title;
        d.dose = d.dose;
      });


    svg.selectAll('.chart')
      .data(data.interventions)
      .enter()
      .append('rect')
      .style("opacity", 0.1)
      .attr('width', function(d,i){
        // console.log(x(d.end)-x(d.start));
          return x(d.end)-x(d.start);
      })
      .attr('x', function(d) {
          return x(d.start);
        })
      .attr('height', function(d) {
        return height
      })
      .attr("class", "interventions")
      .attr("fill", function(d){
          return color(x(d.end)-x(d.start));
      });

    svg.selectAll('.chart')
      .data(data.interventions)
      .enter()
      .append("text")
      .html(function(d){
        // console.log(d);
        return d.title+" - "+d.dose;
      })
      .style("opacity", 1)
      .attr('x', function(d) {
          return x(d.start)+25;
        })
      .attr('y', margin.top)
      .attr("class", "intervention-text")
      .attr('width', function(d,i){
        // console.log(x(d.end)-x(d.start));
          return x(d.end)-x(d.start);
      })
      .style('background-color', 'red')
      .attr("fill", "black");
    }

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

// ** Update data section (Called from the onclick)
function updateData() {
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/cholesterol-session',
      dataType: 'json',
      success: function (data) {
        // console.log(data);
        updateMultiLine({entries: data.entries, interventions: [data.intervention]});
      },
      error: function (result) {
         error();
      }
    });
}

function updateMultiLine(data){
  var color = d3.scale.category20();   // set the colour scale
// console.log(data);
var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 768 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse;



// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    // .ticks(data.entries.length/4)
    .tickFormat(d3.time.format("%b %Y"))
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
  // .tickPadding(10)
  // .ticks(data.entries.length/4)
  // .tickSize(-width)
  // .tickSubdivide(true)
    .orient("left");
    data.entries.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });

// Define the line
var priceline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });
    // Scale the range of the data
    x.domain(d3.extent(data.entries, function(d) { return d.date; }));
    y.domain([0, d3.max(data.entries, function(d) { return d.value; })+75]);

      console.log(d3.select("#graph").selectAll('rect').empty());


        var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;
        data.interventions.forEach(function(d) {
          d.start = parseInterventionDate(d.start);
          d.end = parseInterventionDate(d.end);
          d.title = d.title;
          d.dose = d.dose;
        });


    if(d3.select("#graph").selectAll('rect').empty()){
        var svg = d3.select("#graph")
                    .attr("width", 925)
                    .attr("height", height + margin.top + margin.bottom);
        svg.selectAll('.chart')
          .data(data.interventions)

          .append('rect')
          .style("opacity", 0.1)
          .attr('width', function(d,i){
            // console.log(x(d.end)-x(d.start));

              return x(d.end)-x(d.start);
          })
          .attr('x', function(d) {
              return x(d.start)+margin.left;
            })
          .attr('y', margin.top)
          .attr('height', function(d) {
            return height
          })
          .attr("class", "interventions")
          .attr("fill", function(d){
              return color(x(d.end)-x(d.start));
          });

        svg.selectAll('.chart')
          .data(data.interventions)

          .append("text")
          .html(function(d){
            // console.log(d);
            return d.title+" - "+d.dose;
          })
          .style("opacity", 1)
          .attr('x', function(d) {
              return x(d.start)+(margin.left+2);
            })
          .attr('y', margin.top*2)
          .attr("class", "intervention-text")
          .attr('width', function(d,i){
            // console.log(x(d.end)-x(d.start));
              return x(d.end)-x(d.start);
          })
          .style('background-color', 'red')
          .attr("fill", "black");
    }
    else{
          // Select the section we want to apply our changes to
          var svg = d3.select("#graph").transition();

          svg.selectAll('rect')
              .duration(750)
              // .attr("fill", "red")
              .attr('x', function(d,i) {
                // console.log(d, data.interventions, x(data.interventions[i].start)+25);
                return x(data.interventions[i].start);
              })
              .attr("width", function(d, i){
                  return x(data.interventions[i].end)-x(data.interventions[i].start);
              });

          svg.selectAll(".intervention-text")
              .duration(750)
              // .attr("fill", "red")
              .attr('x', function(d,i) {
                // console.log(d, data.interventions, x(data.interventions[i].start)+25);
                return x(data.interventions[i].start)+25;
              })
              .attr("width", function(d, i){
                  return x(data.interventions[i].end)-x(data.interventions[i].start);
              })
              .text(function(d, i){
                // console.log(d);
                return data.interventions[i].title+" - "+data.interventions[i].dose;
              });
    }


}


function error() {
    console.log("error")
}

