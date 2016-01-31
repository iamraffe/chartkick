$(document).ready(function(e){

  if($('#session-graph-container').length > 0){
    drawGraphFromSession();
  }

    d3.selectAll("[type=checkbox][name=cholesterol_hdl]").on("change", function() {

    var selected = this.value;
    opacity = this.checked ? 1 : 0;

    d3.selectAll(".tagHDL")
        .transition().duration(500)
        .style("opacity", opacity);
    d3.selectAll(".tagCHOLESTEROL")
        .transition().duration(500)
        .style("opacity", opacity);
    });

  d3.selectAll("[type=checkbox][name=triglycerides_ldl]").on("change", function() {

    var selected = this.value;
    opacity = this.checked ? 1 : 0;

    d3.selectAll(".tagLDL")
        .transition().duration(500)
        .style("opacity", opacity);

    d3.selectAll(".tagTRIGLYCERIDES")
        .transition().duration(500)
        .style("opacity", opacity);
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
  var name = $(".patient-name").text();
  //ADD PATIENT NAME
  d3.select("svg")
    .append('text')
      .attr('class', 'patient-name-svg')
      .text('Cholesterol chart: ' + name)
        .attr('x', 215).attr('y', 75)
        .style('fill', 'black')
        .style("font-weight", "bold")
        .style("font-size", 26)
        .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');

  //SVG TO STRING
  var svg_data = (new XMLSerializer()).serializeToString(d3.select('svg').node());

  //PREPARE DATA FOR AJAX CALL
  var blob = {'blob' : svg_data};

  $.ajax({
    type: "POST",
    url: '/charts/cholesterol/export/',
    dataType: "json",
    data: blob,
    success: function(response){
      console.log(response)
      var link = document.createElement('a');
      link.download = slugify(name)+Date.now()+".png";
      link.href= "data:image/svg+xml;base64," +  response.png;
      document.body.appendChild(link);
      link.click();
      console.log(link);
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
      url: '/charts/cholesterol/'+id,
      dataType: 'json',
      success: function (data) {
        d3.select("#export")
          .on("click", exported);
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
      drawMultiLine(data);
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
          .attr("width", 925)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

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

    var color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);

    legendSpace = width/dataNest.length; // spacing for the legend

    var th =d3.scale.ordinal().range([130, 46, 150, 200]);
    var thd =d3.scale.ordinal().domain([130, 46, 150, 200]);

    dataNest.forEach(function(d,i) {
        svg.append("clipPath")
              .attr("id", "clip-"+d.key+"-above")
            .append("rect")
              .attr("width", width)
              .attr("height", function(){
                console.log(th(d.key), d.key);
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
              .attr("clip-path", function() { return "url(#clip-"+d.key+"-" + v + ")"; })
              .style("stroke-dasharray", function(){
                if(i == 0){
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
            .attr("x", (legendSpace/2)+i*legendSpace)
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")
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
          if(th(d.symbol) < d.value){
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
        });

    /*
    =============================

                    INTERVENTIONS

    =============================
     */

    if(data.interventions.length>0){
      var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;
      data.interventions.forEach(function(d) {
        d.start = parseInterventionDate(d.start);
        d.end = parseInterventionDate(d.end);
        d.title = d.title;
        d.description = d.description;
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
      .attr('y',75)
      .attr('height', function(d) {
        return height-75;
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
        return d.title+" - "+d.description;
      })
      .style("opacity", 1)
      .attr('x', function(d) {
          return x(d.start)+5;
        })
      .attr('y', 60)
      .attr("class", "intervention-text")
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
            // console.log(d);
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
          return "intervention-"+d.id;
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
            return "intervention-text-"+d.id;
          })
          // .attr('y', margin.top+75)
          // .attr("class", "intervention-text")
          .attr('width', function(d,i){
            // console.log(x(d.end)-x(d.start));
              return x(d.end)-x(d.start);
          })
          .attr("fill", "black");
}


function updateIntervention(data){

  console.log(data)

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
      console.log(intervention, index, '.intervention-'+intervention.id, svg.select(".intervention-"+intervention.id));

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

    // data.interventions.each(function(intervention, index) {
    //   console.log(invervention, index, svg);

    //   // intervention.start = parseInterventionDate(intervention.start);
    //   // intervention.end = parseInterventionDate(intervention.end);
    //   // intervention.title = intervention.title;
    //   // intervention.description = intervention.description;

    //   console.log(svg.selectAll('.intervention-'+intervention.id));
    //   // svg.selectAll('.intervention-'+intervention.id)
    //   //     .duration(750)
    //   //     .attr('x', function() {
    //   //       return parseInt(x(intervention.start))+50;
    //   //     })
    //   //     .attr("width", function(){
    //   //         return x(intervention.end)-x(intervention.start);
    //   //     });

    //   // svg.selectAll(".intervention-text-"+intervention.id)
    //   //     .duration(750)
    //   //     .attr('x', function() {
    //   //       return parseInt(x(intervention.start))+50;
    //   //     })
    //   //     .attr("width", function(){
    //   //         return x(intervention.end)-x(intervention.start);
    //   //     })
    //   //     .text(function(){
    //   //       return intervention.title+" - "+intervention.description;
    //   //     });


    // });



    // console.log(intervention);
    // intervention.start = parseInterventionDate(intervention.start);
    // intervention.end = parseInterventionDate(intervention.end);
    // intervention.title = intervention.title;
    // intervention.description = intervention.description;

    // console.log(intervention);
    // var svg = d3.select("#graph").transition();
    // // console.log(svg);
    // console.log(svg.select('.'+intervention.id));
    // svg.select('.'+intervention.id)
    //     .duration(750)
    //     .attr('x', function() {
    //       return x(intervention.start);
    //     })
    //     .attr("width", function(){
    //         return x(intervention.end)-x(intervention.start);
    //     });

    // svg.selectAll(".intervention-text"+intervention.id)
    //     .duration(750)
    //     .attr('x', function() {
    //       return x(intervention.start)+25;
    //     })
    //     .attr("width", function(){
    //         return x(intervention.end)-x(intervention.start);
    //     })
    //     .text(function(){
    //       return intervention.title+" - "+intervention.description;
    //     });
}


function error() {
    console.log("error")
}
