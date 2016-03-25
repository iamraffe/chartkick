/*

  GRAPH RENDER FUNCTION

*/

DVE.Graph.prototype.render = function () {
  console.log(this.graph_type, this.charts[this.graph_type])
  this.charts[this.graph_type](this.data);
  // this.svg.append("g")
  //           .attr("class", "x axis")
  //           .attr("transform", "translate(0," + this.height + ")")
  //           .call(this.xAxis);
  // this.svg.append("g")
  //           .attr("class", "y axis")
  //           .call(this.yAxis);
  // this.svg.selectAll('.axis text')
  //           .style('fill', 'black')
  //           .style('stroke-width', 0)
  //           .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');
  // this.svg.selectAll('.axis path')
  //           .style('stroke', 'black')
  //           .style('fill', 'none')
  //           .style('stroke-width', 2);
  //   this.svg.selectAll('.text-values')
  //       .data(this.data.entries)
  //       .enter()
  //       .append("text")
  //       .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
  //       .style("font-weight", "bold")
  //       .style("font-size", 10)
  //       .attr("id", function(d,i){
  //         return 'val'+d.symbol.replace(/\s+/g, '')+i;
  //       })
  //       .attr('class', function(d,i){
  //         return 'text-values tag'+d.symbol.replace(/\s+/g, '');
  //       })
  //       .attr("transform", function(d) {
  //         if(d.symbol === 'HDL' || d.symbol === 'LDL'){
  //           return "translate("+(this.x(d.date)-7.5)+","+(this.y(d.value)+20)+")";
  //         }
  //         else{
  //           return "translate("+(this.x(d.date)-7.5)+","+(this.y(d.value)-10)+")";
  //         }
  //       }.bind(this))
  //       .text(function(d){
  //         return d.value;
  //       })
  //       .style("fill", function(d) {
  //           return this.color(d.symbol);
  //       }.bind(this));
        // .call(this.drag);
};
