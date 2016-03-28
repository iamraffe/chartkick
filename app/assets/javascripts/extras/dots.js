/*

  GRAPH DOTS ON LINES

*/

DVE.Graph.prototype.draw_dots = function () {
  // console.log(this.data.entries);
  this.svg.selectAll('.dots')
    .data(this.data.entries)
    .enter()
    .append("g")
    .attr("class", function(d, i){
      return 'dots tag'+ d.symbol.replace(/\s+/g, '')
    })
    .attr('clip-path', "url(#clip)")
    .append('circle')
    .attr("r", 5)
    .attr('fill', function(d,i){
      if((typeof this.threshold[d.symbol].over != 'undefined' && this.threshold[d.symbol].over != null && this.threshold[d.symbol].over < d.value) ||
        (typeof this.threshold[d.symbol].under != 'undefined' && !this.threshold[d.symbol].under != null&& this.threshold[d.symbol].under > d.value)){
        return "#fff";
      }
      else{
        return this.color(d.symbol);
      }
    }.bind(this))
    .attr('stroke', function(d,i){
      return this.color(d.symbol);
    }.bind(this))
    .attr("transform", function(d) {
      return "translate("+this.x(d.date)+","+this.y(d.value)+")";
    }.bind(this));
}
