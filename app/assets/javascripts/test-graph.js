$(document).ready(function(e){
  if($('#test-container').length > 0){
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/',
      dataType: 'json',
      success: function (data) {
        // console.log(data);
        drawTest(data) 
      },
      error: function (result) {
         error();
      }
    });
    
  }
});

function drawTest(data) {
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.temperature = +d.temperature;
  });

  x.domain([data[0].date, data[data.length - 1].date]);
  y.domain(d3.extent(data, function(d) { return d.temperature; }));

  svg.append("clipPath")
      .attr("id", "clip-above")
    .append("rect")
      .attr("width", width)
      .attr("height", y(59));

  svg.append("clipPath")
      .attr("id", "clip-below")
    .append("rect")
      .attr("y", y(59))
      .attr("width", width)
      .attr("height", height - y(59));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature (ºF)");

  svg.append("g")
      .classed("line", true)
    .selectAll("path")
      .data(["above", "below"])
    .enter().append("path")
      .style("fill", "none")
      .style("stroke-width", "1.5px")
      .style("stroke-dasharray", function(d){
        if(d === "below"){
          return ("0, 0");
        }
        else{
          return ("2, 2");
        }
      })
      .style("stroke", function(d){
        if(d === "below"){
          return "#000";
        }
        else{
          return "#f00";
        }
      })
      .attr("class", function(d) { return "path path--" + d; })
      .attr("clip-path", function(d) { return "url(#clip-" + d + ")"; })
      .datum(data)
      .attr("d", line);

  d3.select("#button")
      .attr("id", "not")
      .datum({visible: true})
      .on("click", clicked);

  d3.select("#export")
      .on("click", exported);

  function clicked(d) {
    d3.select(".line").transition()
        .duration(750)
        .style("opacity", (d.visible = !d.visible) ? 1 : 0);
  }

  function exported() {
    var doctype = '<?xml version="1.0" standalone="no"?>'
      + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

    // serialize our SVG XML to a string.
    var source = (new XMLSerializer()).serializeToString(d3.select('svg').node());

    // create a file blob of our SVG.
    var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });

    var url = window.URL.createObjectURL(blob);

    // Put the svg into an image tag so that the Canvas element can read it in.
    var img = d3.select('body').append('img')
     .attr('width', 960)
     .attr('height', 500)
     .node();


    img.onload = function(){
      // Now that the image has loaded, put the image into a canvas element.
      var canvas = d3.select('body').append('canvas').node();
      canvas.width = 960;
      canvas.height = 500;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      var canvasUrl = canvas.toDataURL("image/png");
      var img2 = d3.select('body').append('img')
        .attr('width', 960)
        .attr('height', 500)
        .node();
      // this is now the base64 encoded version of our PNG! you could optionally 
      // redirect the user to download the PNG by sending them to the url with 
      // `window.location.href= canvasUrl`.
      img2.src = canvasUrl; 
    }
    // start loading the image.
    img.src = url;
  }

}
