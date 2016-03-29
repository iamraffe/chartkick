/*

  ADD INTERVENTION TO CHARTS

*/

DVE.Graph.prototype.edit_intervention = function (data) {

// var color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);

// var margin = {top: 30, right: 20, bottom: 70, left: 50},
//     width = 768 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

// // Parse the date / time
// var parseDate = d3.time.format("%b %Y").parse;



// // Set the ranges
// var x = d3.time.scale().range([0, width]);
// var y = d3.scale.linear().range([height, 0]);

// // Define the axes
// var xAxis = d3.svg.axis().scale(x)
//     // .ticks(data.entries.length/4)
//     .tickFormat(d3.time.format("%b %Y"))
//     .orient("bottom");

// var yAxis = d3.svg.axis().scale(y)
//     .orient("left");

    // data.entries.forEach(function(d) {
    //   d.date = parseDate(d.date);
    //   d.value = +d.value;
    // });

  // Define the line
  // var priceline = d3.svg.line()
  //     .x(function(d) { return x(d.date); })
  //     .y(function(d) { return y(d.value); });

    // Scale the range of the data
    // var minDate = new Date(data.entries[0].date.getFullYear()-1, data.entries[0].date.getMonth()+1,data.entries[0].date.getDate());
    // var maxDate = new Date(data.entries[data.entries.length - 1].date.getFullYear()+1, data.entries[data.entries.length - 1].date.getMonth()+1,data.entries[data.entries.length - 1].date.getDate());

    // x.domain([minDate, maxDate]);
    // y.domain([d3.min(data.entries, function(d) { return d.value; })-75, d3.max(data.entries, function(d) { return d.value; })+75]);

    var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;


    // Select the section we want to apply our changes to
    var svg = d3.select(".chart");

    data.interventions.forEach(function(intervention, index) {
      console.log(svg, intervention, index)

      intervention.start = parseInterventionDate(intervention.start);
      intervention.end = parseInterventionDate(intervention.end);
      intervention.title = intervention.title;
      intervention.description = intervention.description;

      console.log(svg, intervention, index, svg.select('.intervention-'+intervention.id))

      svg.select('.intervention-'+intervention.id)
          .transition()
          .duration(750)
          .attr('x', function() {
            console.log("X", this.x(intervention.start))
            return parseInt(this.x(intervention.start))+50;
          }.bind(this))
          .attr("width", function(){
            console.log("RESTA", this.x(intervention.end)-this.x(intervention.start))
            return this.x(intervention.end)-this.x(intervention.start);
          }.bind(this));

      // svg.select(".intervention-text-"+intervention.id)
      //     .transition()
      //     .duration(750)
      //     .attr('x', function() {
      //       return parseInt(this.x(intervention.start))+50;
      //     }.bind(this))
      //     .attr("width", function(){
      //         return this.x(intervention.end)-this.x(intervention.start);
      //     }.bind(this))
      //     .text(function(){
      //       return intervention.title+" - "+intervention.description;
      //     }.bind(this));
    });
}
