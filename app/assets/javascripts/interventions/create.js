/*

  ADD INTERVENTION TO CHARTS

*/

DVE.Graph.prototype.add_intervention = function (data) {

  var x = d3.time.scale().range([0, this.width]);

  var y = d3.scale.linear();

  var color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);

  var minDate = this.data.entries[0].date;
  var maxDate = this.data.entries[this.data.entries.length - 1].date;

  x.domain([
    new Date(minDate.getFullYear()-1, minDate.getMonth()+1,minDate.getDate()),
    new Date(maxDate.getFullYear()+1, maxDate.getMonth()+1,maxDate.getDate())
  ]);

  y.domain([d3.min(this.data.entries, function(d) { return d.value; }), d3.max(this.data.entries, function(d) { return d.value; })]);

  function left_border(d){
    return x(d.start) < x(minDate) ? x(minDate) : x(d.start);
  }

  function right_border(d){
    return x(d.end) > x(maxDate) ? x(maxDate) : x(d.end);
  }

  var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;

  data.interventions.forEach(function(d) {
    d.start = parseInterventionDate(d.start);
    d.end = parseInterventionDate(d.end);
    d.title = d.title;
    d.description = d.description;
  });

  var svg = this.svg;

  if(this.number_of_symbols < this.data.entries.length){

        var rect = svg.selectAll(".new-interventions").data(data.interventions);
        var rectEnter = rect.enter().append("rect");

        rectEnter.style("opacity", 0.1)
        .attr('width', function(d,i){
          return right_border(d) - left_border(d);
        }.bind(this))
        .attr('x', function(d) {
            return left_border(d);
        }.bind(this))
        .attr('y', function(d,i){
          return (25*d.index)+75;
        }.bind(this))
        .attr('height', function(d,i) {
          return this.height-(25*d.index)-150
        }.bind(this))
        .attr("class", function(d){
          return "interventions intervention--type--"+d.type+" intervention-"+d.id;
        }.bind(this))
        .attr("fill", function(d){
            return color(d.type);
        }.bind(this));

        svg.selectAll('.chart')
          .data(data.interventions)
          .enter()
          .append("text")
          .html(function(d){
            return d.title+" - "+d.description;
          })
          .style("opacity", 1)
          .attr('x', function(d) {
              return left_border(d)+10;
          }.bind(this))
          .attr('y', function(d,i){
            return (25*d.index)+65;
          }.bind(this))
          .attr("class", function(d){
            return "intervention-text intervention--type--"+d.type+" intervention-text-"+d.id;
          })
          .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
          .style("font-weight", "bold")
          .style("text-transform", "uppercase")
          .attr("fill", "black");
  }
  else{

    var new_interventions = svg.selectAll(".new-interventions").data(data.interventions);

    var text = new_interventions.enter().append("text");

    console.log("after enter", data.interventions)

      text.attr("x", (this.width/3)*2)
    .attr("y", function(d,i){ 
      console.log(this.height, this.margin, i)
      return this.height + ((d.index+1)*this.margin.bottom/4) + 15
    }.bind(this))
    .attr("class", function(d){
      return "interventions intervention--type--"+d.type+" intervention-"+d.id;
    }.bind(this))
    .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
    .style('font-size', 11)
    // .style("font-weight", "bold")
    .style("fill", function(d) {
        return this.color(d.type);
    }.bind(this))
    // .append("tspan")
    .html(function(d){
      return d.type.capitalize()+"<br>: "+d.title.capitalize(true)+" - "+d.description.capitalize(true);
    });
  }

}
