$(document).ready(function(e){
  if($('#vitamin-d-session-graph').length > 0){
    drawVitaminDGraphFromSession(d3.scale.ordinal().range(['#4FCFEB', '#A725A7']));
  }
  if($('#tsh-session-graph').length > 0){
    drawVitaminDGraphFromSession(d3.scale.ordinal().range(['#111A33', '#001E93']));
  }
  // if($('#vitamin-d-db-graph').length > 0){
  //   drawVitaminDGraphFromDB();
  // }

  if($('#session-graph-container').length > 0){
    drawGraphFromSession();
  }
    d3.selectAll("[type=checkbox][name=visible_interventions]").on("change", function() {
      var selected = this.value;
      // console.log(this.value);
      var type = ".intervention--type--"+this.value;
      var opacity = this.checked ? 0.1 : 0;
      d3.selectAll(".interventions"+type)
          .transition().duration(500)
          .style("opacity", opacity);
      d3.selectAll(".intervention-text"+type)
          .transition().duration(500)
          .style("opacity", opacity*10);
    });

    d3.selectAll("[type=radio][name=optradio]").on("click", function() {
      if(this.value === "gauge"){
        d3.selectAll("#gauge")
            .transition().duration(500)
            .style("opacity", 1);

        d3.selectAll(".tagLDL")
            .transition().duration(500)
            .style("opacity", 0);

        d3.selectAll(".tagTRIGLYCERIDES")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagHDL")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagCHOLESTEROL")
            .transition().duration(500)
            .style("opacity", 1);
      }
      else if(this.value === "all"){
        d3.selectAll("#gauge")
            .transition().duration(500)
            .style("opacity", 0);

        d3.selectAll(".tagLDL")
            .transition().duration(500)
            .style("opacity", 1);

        d3.selectAll(".tagTRIGLYCERIDES")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagHDL")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagCHOLESTEROL")
            .transition().duration(500)
            .style("opacity", 1);
      }
      else if(this.value === "other"){
        d3.selectAll("#gauge")
            .transition().duration(500)
            .style("opacity", 0);

        d3.selectAll(".tagHDL")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagCHOLESTEROL")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagLDL")
            .transition().duration(500)
            .style("opacity", 1);

        d3.selectAll(".tagTRIGLYCERIDES")
            .transition().duration(500)
            .style("opacity", 1);
      }
    });

});

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function deleteName(){
 $('.patient-name-svg').remove();
}

function exported() {
  var name = $("#graph").attr('data-name');
  //ADD PATIENT NAME
  d3.select("svg")
    .append('text')
      .attr('class', 'patient-name-svg')
      .text(name)
        .attr('x', 215).attr('y', 25)
        .style('fill', 'black')
        .style("font-weight", "bold")
        .style("font-size", 26)
        .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');

  //SVG TO STRING
  var svg_data = (new XMLSerializer()).serializeToString(d3.select('svg').node());

  //PREPARE DATA FOR AJAX CALL
  var blob = {'authenticity_token': $('meta[name=csrf-token]').attr('content'), 'blob' : svg_data};

  $.ajax({
    type: "POST",
    url: '/charts/export/',
    dataType: "json",
    data: blob,
    success: function(response){
      var link = document.createElement('a');
      link.download = slugify(name)+Date.now()+".png";
      link.href= "data:image/svg+xml;base64," +  response.png;
      document.body.appendChild(link);
      link.click();
      deleteName();
    },
    error: function (error){
      console.log(error)
    }
  });
}

$(document).ready(function(e){
  if($('#db-graph-container').length > 0){
    var id = document.URL.split("/").pop();
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/charts/'+id,
      dataType: 'json',
      success: function (data) {
        d3.select("#export")
          .on("click", exported);
        drawMultiLine(data);
        drawGauge(data.entries);
      },
      error: function (result) {
         error();
      }
    });
  }
  if($('#vitamin-d-db-graph').length > 0){
    var id = document.URL.split("/").pop();
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/charts/'+id,
      dataType: 'json',
      success: function (data) {
        drawVitaminDGraph(data, d3.scale.ordinal().range(['#4FCFEB', '#A725A7']));
        d3.select("#export")
          .on("click", exported);
        // drawMultiLine(data);
        // drawGauge(data.entries);
      },
      error: function (result) {
         error();
      }
    });
  }
  if($('#tsh-db-graph').length > 0){
    var id = document.URL.split("/").pop();
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/charts/'+id,
      dataType: 'json',
      success: function (data) {
        drawVitaminDGraph(data, d3.scale.ordinal().range(['#111A33', '#001E93']));
        d3.select("#export")
          .on("click", exported);
        // drawMultiLine(data);
        // drawGauge(data.entries);
      },
      error: function (result) {
         error();
      }
    });
  }
});

function drawVitaminDGraphFromSession(color){
  $.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    url: '/chart-session',
    dataType: 'json',
    success: function (data) {
      drawVitaminDGraph(data, color);
    },
    error: function (result) {
       error();
    }
  });
}

function drawVitaminDGraph(data, color){
  var margin = {top: 30, right: 20, bottom: 70, left: 50},
      width = 768 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%b %Y").parse;

  var th =d3.scale.ordinal().range([130, 40, 150, 160]);
  var thd =d3.scale.ordinal().domain([130, 40, 150, 160]);

  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis().scale(x)
      .tickFormat(d3.time.format("%m/%y"))
      .orient("bottom");

  var yAxis = d3.svg.axis().scale(y)
    .ticks(data.entries.length/4)
    .orient("left");

  var priceline = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("#graph")
      .append("svg")
          .attr("class", "chart")
          .attr("width", 775)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

    //  WE ONLY WANT THE LAST 5
    data.entries = data.entries.slice(-5);

    // var color = d3.scale.ordinal().range(['#4FCFEB', '#A725A7']);


    data.entries.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });

    var minDate = new Date(data.entries[0].date.getFullYear()-1, data.entries[0].date.getMonth()+1,data.entries[0].date.getDate());
    var maxDate = new Date(data.entries[data.entries.length - 1].date.getFullYear()+1, data.entries[data.entries.length - 1].date.getMonth()+1,data.entries[data.entries.length - 1].date.getDate());

    x.domain([minDate, maxDate]);
    y.domain([d3.min(data.entries, function(d) { return d.value; })-75, d3.max(data.entries, function(d) { return d.value; })+75]);




    draw_interventions(data, svg, x, y, color, height);

        svg.append("clipPath")
              .attr("id", "clip-above")
            .append("rect")
              .attr("width", width)
              .attr("height", y(55));

          svg.append("clipPath")
              .attr("id", "clip-below")
            .append("rect")
              .attr("y", y(55))
              .attr("width", width)
              .attr("height", height - y(55));

          svg.append("g")
            .classed("line", true)
          .selectAll("path")
            .data(["above", "below"])
          .enter().append("path")
            .attr("class", function(d) { return "path path--" + d; })
            .attr("clip-path", function(d) { return "url(#clip-" + d + ")"; })
            .datum(data.entries)
            .style('fill', 'none')
            .attr("d", priceline)
            .attr('stroke', function(d,i){
              return color(d.symbol);
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

    svg.selectAll('.axis text')
    .style('fill', 'black')
    .style('stroke-width', 0)
    .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');

    svg.selectAll('.axis path')
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 2);

    // svg.selectAll('.tick line').style('fill', 'black');

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
        .attr("r", 5)
        .attr('fill', function(d,i){
          return d.color = color(d.symbol);
        })
        .attr('stroke', function(d,i){
          return color(d.symbol);
        })
        .attr("transform", function(d) {
          return "translate("+x(d.date)+","+y(d.value)+")";
        });
    // Add the text
    svg.selectAll('.text-values')
        .data(data.entries)
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
            return "translate("+(x(d.date)-7.5)+","+(y(d.value)+20)+")";
          }
          else{
            return "translate("+(x(d.date)-7.5)+","+(y(d.value)-10)+")";
          }
        })
        .text(function(d){
          return d.value;
        })
        .style("fill", function(d) { // Add the colours dynamically
            return color(d.symbol);
        });



}


function drawGraphFromSession(){
  $.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    url: '/chart-session',
    dataType: 'json',
    success: function (data) {
      drawMultiLine(data);
      // console.log(data);
      drawGauge(data.entries);
      data.interventions.forEach(function(d,i){
        d.start = new Date(d.start).getFullYear()+ "-"+(new Date(d.start).getMonth()+1)+"-"+new Date(d.start).getDate();
        d.end = new Date(d.end).getFullYear()+ "-"+(new Date(d.end).getMonth()+1)+"-"+new Date(d.end).getDate();
        $(' ul#added-'+d.type+'-interventions').html('<li class="animated flash"><span class="added-title">'+d.title+'</span> - <span class="added-description">'+d.description+'</span><span class="added-dates">(<span class="added-date-start">'+d.start+'</span> - <span class="added-date-end">'+d.end+'</span>)</span></li>');
      });
    },
    error: function (result) {
       error();
    }
  });
}

function drawMultiLine(data) {
  var margin = {top: 30, right: 20, bottom: 70, left: 50},
      width = 768 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%b %Y").parse;

  var drag = d3.behavior.drag()
    .on("drag", function(d,i) {
        d.value -= d3.event.dy
        // console.log(d3.event);
        d3.select(this).attr("transform", function(d,i){
          if(d.symbol === 'HDL' || d.symbol === 'LDL'){
            return "translate("+(d3.event.x)+","+(y(d.value)+20)+")";
          }
          else{
            return "translate("+(d3.event.x)+","+(y(d.value)-10)+")";
          }
        })
    });

  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis().scale(x)
      .tickFormat(d3.time.format("%m/%y"))
      .orient("bottom");

  var yAxis = d3.svg.axis().scale(y)
    .ticks(data.entries.length/4)
    .orient("left");

  var priceline = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("#graph")
      .append("svg")
          .attr("class", "chart")
          .attr("width", 775)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

    //  WE ONLY WANT THE LAST 5
    data.entries = data.entries.slice(-20);

    data.entries.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });



    var minDate = new Date(data.entries[0].date.getFullYear()-1, data.entries[0].date.getMonth()+1,data.entries[0].date.getDate());
    var maxDate = new Date(data.entries[data.entries.length - 1].date.getFullYear()+1, data.entries[data.entries.length - 1].date.getMonth()+1,data.entries[data.entries.length - 1].date.getDate());

    x.domain([minDate, maxDate]);
    y.domain([d3.min(data.entries, function(d) { return d.value; })-75, d3.max(data.entries, function(d) { return d.value; })+75]);

    var dataNest = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(data.entries);

    // dataNest.forEach(function(d,i) {
    //   d.values = d.values.slice(-5);
    // });

    var color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);

    legendSpace = width/dataNest.length; // spacing for the legend

    var th =d3.scale.ordinal().range([130, 40, 150, 160]);
    var thd =d3.scale.ordinal().domain([130, 40, 150, 160]);

    draw_interventions(data, svg, x, y, color, height);

    dataNest.forEach(function(d,i) {
        svg.append("clipPath")
              .attr("id", "clip-"+d.key+"-above")
            .append("rect")
              .attr("width", width)
              .attr("height", function(){
                // console.log(th(d.key), d.key);
                return y(th(d.key));
              });

          svg.append("clipPath")
              .attr("id", "clip-"+d.key+"-below")
            .append("rect")
              .attr("y", y(th(d.key)))
              .attr("width", width)
              .attr("height", height - y(th(d.key)));

          var clip = ["below", "above"];

          clip.forEach(function(v,i){
            svg.append("path")
              .attr("class", function() { return 'tag'+d.key.replace(/\s+/g, '') + " line " + v; })
              .attr("clip-path", function() {
                if((i == 0 && d.key !== "HDL") || (i === 0 && d.key === "HDL")){
                  return "url(#clip-"+d.key+"-" + "below" + ")";
                }
                else{
                  return "url(#clip-"+d.key+"-" + "above" + ")";
                }
              })
              .style("stroke-dasharray", function(){
                if((i == 0 && d.key !== "HDL") || (i == 1 && d.key === "HDL")){
                  // console.log(i,v,d);
                  return ("0, 0");
                }
                else{
                  return ("5, 5");
                }
              })
              .attr("d", priceline(d.values))
              .style('fill', 'none')
              .style("stroke", function() { // Add the colours dynamically
                  return color(d.key);
              });
          });

        // Add the Legend
        svg.append("text")
            .attr("x", (i*legendSpace)+margin.left)
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", function(){
              return 'legend tag'+ d.key.replace(/\s+/g, '')
            })
            // .attr("class", "legend")
            .attr('style', 'font-family: "Trebuchet MS", Helvetica, sans-serif')
            .style("fill", function() {
                return color(d.key);
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

    svg.selectAll('.axis text')
    .style('fill', 'black')
    .style('stroke-width', 0)
    .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');

    svg.selectAll('.axis path')
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 2);

    // svg.selectAll('.tick line').style('fill', 'black');

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
        .attr("r", 5)
        .attr('fill', function(d,i){
          if((d.symbol !== "HDL" && th(d.symbol) < d.value) || (d.symbol === "HDL" && th(d.symbol) > d.value)){
            return "#fff";
          }
          else{
            return d.color = color(d.symbol);
          }
          // console.log(th(d.symbol));

        })
        .attr('stroke', function(d,i){
          return color(d.symbol);
        })
        .attr("transform", function(d) {
          return "translate("+x(d.date)+","+y(d.value)+")";
        });
    // Add the text
    svg.selectAll('.text-values')
        .data(data.entries)
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
            return "translate("+(x(d.date)-7.5)+","+(y(d.value)+20)+")";
          }
          else{
            return "translate("+(x(d.date)-7.5)+","+(y(d.value)-10)+")";
          }
        })
        .text(function(d){
          return d.value;
        })
        .style("fill", function(d) { // Add the colours dynamically
            return color(d.symbol);
        })
        .call(drag);



}

// ** Update data section (Called from the onclick)
function updateData() {
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/cholesterol-session',
      dataType: 'json',
      success: function (data) {
        // updateMultiLine({entries: data.entries, interventions: data.intervention});
        // updateMultiLine(data);
      },
      error: function (result) {
         error();
      }
    });
}

function updateMultiLine(data){
  // console.log(data, data.entries, data.interventions);
  // var color = d3.scale.category20();   // set the colour scale
  var color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);
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
    var minDate = new Date(data.entries[0].date.getFullYear()-1, data.entries[0].date.getMonth()+1,data.entries[0].date.getDate());
    var maxDate = new Date(data.entries[data.entries.length - 1].date.getFullYear()+1, data.entries[data.entries.length - 1].date.getMonth()+1,data.entries[data.entries.length - 1].date.getDate());

    x.domain([minDate, maxDate]);
    // x.domain(d3.extent(data.entries, function(d) { return d.date; }));
    y.domain([d3.min(data.entries, function(d) { return d.value; })-75, d3.max(data.entries, function(d) { return d.value; })+75]);

        var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;
        data.interventions.forEach(function(d) {
          d.start = parseInterventionDate(d.start);
          d.end = parseInterventionDate(d.end);
          d.title = d.title;
          d.description = d.description;
        });
        var svg = d3.select("svg");
        var rect = svg.selectAll(".new-interventions").data(data.interventions);
        var rectEnter = rect.enter().append("rect");

        rectEnter.style("opacity", 0.1)
        .attr('width', function(d,i){
            return x(d.end)-x(d.start);
        })
        .attr('x', function(d) {
            return x(d.start)+margin.left;
          })
        .attr('y', function(d,i){
          return 75+margin.top +(25*d.index);
        })
        .attr('height', function(d,i) {
          return height-75-(25*d.index)
        })
        .attr("class", function(d){
          return "interventions intervention--type--"+d.type+" intervention-"+d.id;
        })
        .attr("fill", function(d){
            return color(x(d.end)-x(d.start));
        });

        svg.selectAll('.chart')
          .data(data.interventions)
          .enter()
          .append("text")
          .html(function(d){
            // console.log(d.title);
            return d.title+" - "+d.description;
          })
          .style("opacity", 1)
          .attr('x', function(d) {
              return x(d.start)+(margin.left+2);
            })
          .attr('y', function(d,i){
            return 90+(25*d.index);
          })
          .attr("class", function(d){
            return "intervention-text intervention--type--"+d.type+" intervention-text-"+d.id;
          })
          .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
          .style("font-weight", "bold")
          .style("text-transform", "uppercase")
          .attr('width', function(d,i){
            // console.log(x(d.end)-x(d.start));
              return x(d.end)-x(d.start);
          })
          .attr("fill", "black");
}

function drawGauge(entries){
var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, el, endPadRad, height, i, margin, needle, numSections, padRad, percToDeg, percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad, svg, totalPercent, width;

    var dataNest = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(entries);

var hdl = dataNest[1].values[dataNest[1].values.length-1].value;

var cholesterol = dataNest[3].values[dataNest[3].values.length-1].value;

percent = (cholesterol/hdl)/10;

barWidth = 10;

numSections = 5;

sectionPerc = 1 / numSections / 2;

padRad = 0.05;

chartInset = 10;

totalPercent = .75;

el = d3.select('svg');

margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 20
};

// width = el[0][0].offsetWidth - margin.left - margin.right;
width = 200;
height = width;

radius = Math.min(width, height) / 2;

percToDeg = function(perc) {
  return perc * 360;
};

percToRad = function(perc) {
  return degToRad(percToDeg(perc));
};

degToRad = function(deg) {
  return deg * Math.PI / 180;
};

// svg = el.append('svg').attr("id", "gauge").attr('opacity', 0).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

// chart = el.append('g').attr("id", "gauge").attr('opacity', 0).attr("x", 550).attr("y", 250).attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");

chart = el.append('g').attr("id", "gauge").attr('opacity', 0).attr('transform', "translate(" + 650 + ", " + 362.5 + ")");

for (sectionIndx = i = 1, ref = numSections; 1 <= ref ? i <= ref : i >= ref; sectionIndx = 1 <= ref ? ++i : --i) {
  arcStartRad = percToRad(totalPercent);
  arcEndRad = arcStartRad + percToRad(sectionPerc);
  totalPercent += sectionPerc;
  startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
  endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
  arc = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);
  chart.append('path').attr('class', "arc chart-color" + sectionIndx).attr('d', arc);
}

Needle = (function() {
  function Needle(len, radius1) {
    this.len = len;
    this.radius = radius1;
  }

  Needle.prototype.drawOn = function(el, perc) {
    el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
    return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
  };

  Needle.prototype.animateOn = function(el, perc) {
    var self;
    self = this;
    return el.transition().delay(500).ease('elastic').duration(3000).selectAll('.needle').tween('progress', function() {
      return function(percentOfPercent) {
        var progress;
        progress = percentOfPercent * perc;
        return d3.select(this).attr('d', self.mkCmd(progress));
      };
    });
  };

  Needle.prototype.mkCmd = function(perc) {
    var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
    thetaRad = percToRad(perc / 2);
    centerX = 0;
    centerY = 0;
    topX = centerX - this.len * Math.cos(thetaRad);
    topY = centerY - this.len * Math.sin(thetaRad);
    leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
    leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
    rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
    rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
    return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
  };

  return Needle;

})();

needle = new Needle(60, 7.5);

needle.drawOn(chart, 0);

needle.animateOn(chart, percent);

GaugeText = (function() {
  function GaugeText() {
  }

  GaugeText.prototype.drawOn = function(el, perc) {
    return el.append('text').attr('class', 'gauge-text').text(perc).attr("x", -50).attr("y", 55).style('font-family', '"Trebuchet MS", Helvetica, sans-serif').style("font-weight", "bold").style("font-size", "50px");
  };

  return GaugeText;
})();

gauge_text = new GaugeText();

gauge_text.drawOn(chart, (percent*10).toFixed(2));
}


function updateIntervention(data){

var color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);

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
    var minDate = new Date(data.entries[0].date.getFullYear()-1, data.entries[0].date.getMonth()+1,data.entries[0].date.getDate());
    var maxDate = new Date(data.entries[data.entries.length - 1].date.getFullYear()+1, data.entries[data.entries.length - 1].date.getMonth()+1,data.entries[data.entries.length - 1].date.getDate());

    x.domain([minDate, maxDate]);
    y.domain([d3.min(data.entries, function(d) { return d.value; })-75, d3.max(data.entries, function(d) { return d.value; })+75]);

    var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;


    // Select the section we want to apply our changes to
    var svg = d3.select(".chart").transition();

    data.interventions.forEach(function(intervention, index) {

      intervention.start = parseInterventionDate(intervention.start);
      intervention.end = parseInterventionDate(intervention.end);
      intervention.title = intervention.title;
      intervention.description = intervention.description;

      svg.select('.intervention-'+intervention.id)
          .duration(750)
          .attr('x', function() {
            return parseInt(x(intervention.start))+50;
          })
          .attr("width", function(){
              return x(intervention.end)-x(intervention.start);
          });
      svg.select(".intervention-text-"+intervention.id)
          .duration(750)
          .attr('x', function() {
            return parseInt(x(intervention.start))+50;
          })
          .attr("width", function(){
              return x(intervention.end)-x(intervention.start);
          })
          .text(function(){
            return intervention.title+" - "+intervention.description;
          });
    });
}


function error() {
    console.log("error")
}

function draw_interventions(data, svg, x, y, color, height){
    /*
    =============================

                    INTERVENTIONS

    =============================
     */

    if(data.interventions.length>0){
      console.log(data.interventions);
      var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;

      data.interventions.forEach(function(d) {
        d.start = d3.max([parseInterventionDate(d.start), data.entries[0].date]);
        d.end = d3.min([parseInterventionDate(d.end), data.entries[data.entries.length - 1].date]);
        d.title = d.title;
        d.type = d.type;
        d.id = d.id;
        d.description = d.description;
        d.index = d.index;
      });
      console.log(data.interventions);

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
      .attr('y', function(d,i){
        // console.log(d);
        return 75 +(25*d.index);
      })
      .attr('height', function(d,i) {
        return height-75-(25*d.index)
      })
      .attr("class", function(d,i){
        return "interventions intervention--type--"+d.type+" intervention-"+d.id;
      })
      .attr("fill", function(d){
          return color(x(d.end)-x(d.start));
      });

    svg.selectAll('.chart')
      .data(data.interventions)
      .enter()
      .append("text")
      .html(function(d){
        // console.log(d);
        return d.title+" - "+d.description;
      })
      .style("opacity", 1)
      .attr('x', function(d) {
          return x(d.start)+5;
        })
      .attr('y', function(d,i){
            return 50+(25*d.index);
      })
      .attr("class", function(d){
        return "intervention-text intervention--type--"+d.type+" intervention-text-"+d.id;
      })
      .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
      .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .attr('width', function(d,i){
        // console.log(x(d.end)-x(d.start));
          return x(d.end)-x(d.start);
      })
      .style('background-color', 'red')
      .attr("fill", "black");
    }
}
