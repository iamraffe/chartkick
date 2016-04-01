/*

  ADD INTERVENTION TO CHARTS

*/

DVE.Graph.prototype.update_intervention = function (data) {

  console.log("DATA =>",data)

  console.log("UPDATING INTERVENTION!")

  var x = d3.time.scale().range([0, this.width]);

  var y = d3.scale.linear();

  var color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);

    // // Scale the range of the data
    var minDate = this.data.entries[0].date;
    var maxDate = this.data.entries[this.data.entries.length - 1].date;

    x.domain([
      new Date(minDate.getFullYear()-1, minDate.getMonth()+1,minDate.getDate()),
      new Date(maxDate.getFullYear()+1, maxDate.getMonth()+1,maxDate.getDate())
    ]);

    // x.domain(d3.extent(this.data.entries, function(d) { return d.date; }));

    y.domain([d3.min(this.data.entries, function(d) { return d.value; }), d3.max(this.data.entries, function(d) { return d.value; })]);

    function left_border(d){
      return x(d.start) < x(minDate) ? x(minDate) : x(d.start);
    }

    function right_border(d){
      return x(d.end) > x(maxDate) ? x(maxDate) : x(d.end);
    }

        var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;



    // Select the section we want to apply our changes to
    var svg = this.svg;

    data.forEach(function(intervention, index) {

      intervention.start = parseInterventionDate(intervention.start);
      intervention.end = parseInterventionDate(intervention.end);
      intervention.title = intervention.title;
      intervention.description = intervention.description;

      svg.select('.intervention-'+intervention.id)
          .transition()
          .duration(750)
          .attr('x', function() {
            return left_border(intervention);
            // return x(intervention.start)+50;
          })
          .transition()
          .duration(1500)
          .attr("width", function(){
            return right_border(intervention) - left_border(intervention);
              // return x(intervention.end)-x(intervention.start);
          });


      svg.select(".intervention-text-"+intervention.id)
          .transition()
          .duration(750)
          .attr('x', function() {
            return left_border(intervention);
            // return parseInt(x(intervention.start))+50;
          })
          // .transition()
          // .duration(1500)
          // .attr("width", function(){
          //   eturn right_border(intervention) - left_border(intervention);
          //     // return x(intervention.end)-x(intervention.start);
          // })
          .transition()
          .duration(1500)
          .text(function(){
            return intervention.title+" - "+intervention.description;
          });
    });
























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

    // var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;


    // // Select the section we want to apply our changes to
    // var svg = d3.select(".chart");

    // data.interventions.forEach(function(intervention, index) {
    //   console.log(svg, intervention, index)

    //   intervention.start = parseInterventionDate(intervention.start);
    //   intervention.end = parseInterventionDate(intervention.end);
    //   intervention.title = intervention.title;
    //   intervention.description = intervention.description;

    //   console.log(svg, intervention, index, svg.select('.intervention-'+intervention.id))

    //   svg.select('.intervention-'+intervention.id)
    //       .transition()
    //       .duration(750)
    //       .attr('x', function() {
    //         console.log("X", this.x(intervention.start))
    //         return parseInt(this.x(intervention.start))+50;
    //       }.bind(this))
    //       .attr("width", function(){
    //         console.log("RESTA", this.x(intervention.end)-this.x(intervention.start))
    //         return this.x(intervention.end)-this.x(intervention.start);
    //       }.bind(this));

    //   // svg.select(".intervention-text-"+intervention.id)
    //   //     .transition()
    //   //     .duration(750)
    //   //     .attr('x', function() {
    //   //       return parseInt(this.x(intervention.start))+50;
    //   //     }.bind(this))
    //   //     .attr("width", function(){
    //   //         return this.x(intervention.end)-this.x(intervention.start);
    //   //     }.bind(this))
    //   //     .text(function(){
    //   //       return intervention.title+" - "+intervention.description;
    //   //     }.bind(this));
    // });
}
