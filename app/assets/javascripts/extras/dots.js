/*

  GRAPH DOTS ON LINES

*/

DVE.Graph.prototype.draw_dots = function () {
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
      if((this.threshold[d.symbol].over && this.threshold[d.symbol].value < d.value) || (!this.threshold[d.symbol].over && this.threshold[d.symbol].value > d.value)){
        return "#fff";
      }
      else{
        return d.color = this.color(d.symbol);
      }
    }.bind(this))
    .attr('stroke', function(d,i){
      return this.color(d.symbol);
    }.bind(this))
    .attr("transform", function(d) {
      return "translate("+this.x(d.date)+","+this.y(d.value)+")";
    }.bind(this)); 
}
