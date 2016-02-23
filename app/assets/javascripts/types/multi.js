/*

  MULTILINE CHART

*/

DVE.Graph.prototype.draw_multi = function () {
  // this.drag = d3.behavior.drag()
  //   .on("drag", function(d,i) {
  //       d.value -= d3.event.dy
  //       d3.select(this).attr("transform", function(d,i){
  //         return "translate("+(d3.event.x)+","+(y(d.value)+20)+")";
  //       })
  // });

  // this.color = color;

  this.dataNest = d3.nest()
                    .key(function(d) {return d.symbol;})
                    .entries(this.data.entries);

  this.data.entries = this.data.entries.slice((-1)*this.dataNest.length*this.number_of_symbols);
  this.legendSpace = this.width/this.dataNest.length; // spacing for the legend
  this.dataNest.forEach(function(d,i) {
      
      this.svg.append("clipPath")
            .attr("id", "clip-"+d.key+"-above")
            .append("rect")
              .attr("width", this.width)
              .attr("height", function(){
                console.log(d.key );
                return this.y(this.threshold[d.key].value);
              }.bind(this));

      this.svg.append("clipPath")
          .attr("id", "clip-"+d.key+"-below")
          .append("rect")
            .attr("y", this.y(this.threshold[d.key].value))
            .attr("width", this.width)
            .attr("height", function(){
              return this.height - this.y(this.threshold[d.key].value);
            }.bind(this));

      var clip = ["below", "above"];

      clip.forEach(function(v,i){
        this.svg.append("path")
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
              return ("0, 0");
            }
            else{
              return ("5, 5");
            }
          })
          .attr("d", this.drawline(d.values))
          .style('fill', 'none')
          .style("stroke", function() { // Add the colours dynamically
              return this.color(d.key);
          }.bind(this));
      }.bind(this));

      // Add the Legend
      this.svg.append("text")
          .attr("x", (i*this.legendSpace)+this.margin.left)
          .attr("y", this.height + (this.margin.bottom/2)+ 5)
          .attr("class", function(){
            return 'legend tag'+ d.key.replace(/\s+/g, '')
          })
          .attr('style', 'font-family: "Trebuchet MS", Helvetica, sans-serif')
          .style("fill", function() {
              return this.color(d.key);
          }.bind(this))
          .text(d.key);

  }.bind(this));

};