/*

  CHART INTERVENTIONS

*/

DVE.Graph.prototype.draw_interventions = function () {

  console.log("DRAWING INTERVENTIONS");

  if(this.data.interventions.length>0){

    var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;

    this.data.interventions.forEach(function(d) {
      d.start = d3.max([parseInterventionDate(d.start), this.data.entries[0].date]);
      d.end = d3.min([parseInterventionDate(d.end), this.data.entries[this.data.entries.length - 1].date]);
      d.title = d.title;
      d.type = d.type;
      d.id = d.id;
      d.description = d.description;
      d.index = d.index;
    }.bind(this));

    this.svg.selectAll('.chart')
      .data(this.data.interventions)
      .enter()
      .append('rect')
      .style("opacity", 0.1)
      .attr('width', function(d,i){
        return Math.abs(this.x(d.end)-this.x(d.start));
      }.bind(this))
      .attr('x', function(d) {
          return this.x(d.start);
      }.bind(this))
      .attr('y', function(d,i){
        // console.log(d);
        return 75 +(25*d.index);
      })
      .attr('height', function(d,i) {
        return this.height-75-(25*d.index)
      }.bind(this))
      .attr("class", function(d,i){
        return "interventions intervention--type--"+d.type+" intervention-"+d.id;
      })
      .attr("fill", function(d){
        console.log(this.color);
          return this.color(this.x(d.end)-this.x(d.start));
      }.bind(this));

    this.svg.selectAll('.chart')
      .data(this.data.interventions)
      .enter()
      .append("text")
      .html(function(d){
        // console.log(d);
        return d.title+" - "+d.description;
      })
      .style("opacity", 1)
      .attr('x', function(d) {
          return this.x(d.start)+5;
      }.bind(this))
      .attr('y', function(d,i){
            return 50+(25*d.index);
      })
      .attr("class", function(d){
        return "intervention-text intervention--type--"+d.type+" intervention-text-"+d.id;
      })
      .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
      .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .style('background-color', 'red')
      .attr("fill", "black");

  }
};