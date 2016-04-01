/*

  MULTILINE CHART

*/

DVE.Graph.prototype.draw_multi = function () {

  var number_of_keys = Object.keys(this.threshold).length;

  this.data.entries = this.data.entries.slice((-1)*(number_of_keys+1)*this.number_of_symbols);

  this.legendSpace = this.width/number_of_keys; // spacing for the legend

  this.dataNest = d3.nest()
                    .key(function(d) {return d.symbol;})
                    .entries(this.data.entries);

  var minDate = new Date(this.data.entries[0].date.getFullYear()-1, this.data.entries[0].date.getMonth()+1,this.data.entries[0].date.getDate());
  var maxDate = new Date(this.data.entries[this.data.entries.length - 1].date.getFullYear()+1, this.data.entries[this.data.entries.length - 1].date.getMonth()+1,this.data.entries[this.data.entries.length - 1].date.getDate());

  this.x.domain([minDate, maxDate]);


  this.dataNest.forEach(function(d,i) {

      this.svg.append("clipPath")
            .attr("id", "clip-"+d.key+"-above")
            .append("rect")
              .attr("width", this.width)
              .attr("height", function(){
                if(this.threshold[d.key].over != null){
                  return this.y(this.threshold[d.key].over)
                }else{
                  return this.y(this.threshold[d.key].under)
                }
              }.bind(this));

      this.svg.append("clipPath")
          .attr("id", "clip-"+d.key+"-below")
          .append("rect")
            .attr("y", function(){
              if(this.threshold[d.key].over != null){
                return this.y(this.threshold[d.key].over)
              }else{
                return this.y(this.threshold[d.key].under)
              }
            }.bind(this))
            .attr("width", this.width)
            .attr("height", function(){
              if(this.threshold[d.key].over != null){
                return this.height - this.y(this.threshold[d.key].over);
              }else{
                return this.height - this.y(this.threshold[d.key].under);
              }
              // return this.height - this.y(130);
            }.bind(this));

      var clip = ["below", "above"];

      clip.forEach(function(v,i){
        this.svg.append("path")
          .attr("class", function() { return 'tag'+d.key.replace(/\s+/g, '') + " line " + v; })
          .attr("clip-path", function() {
            return "url(#clip-"+d.key+"-" + v + ")";
          })
          .style("stroke-dasharray", function(){
            if((this.threshold[d.key].over != null && i == 1) || (this.threshold[d.key].under != null && i == 0)){
              return ("5, 5");
            }
            else{
              return ("0, 0");
            }
          }.bind(this))
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
// Add the X Axis
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis);

    // Add the Y Axis
    this.svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis);

    this.svg.selectAll('.axis text')
    .style('fill', 'black')
    .style('stroke-width', 0)
    .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');

    this.svg.selectAll('.axis path')
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 2);

    this.svg.selectAll('.text-values')
        .data(this.data.entries)
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
        .attr("transform", function(d) {
            return "translate("+(this.x(d.date)-7.5)+","+(this.y(d.value)+20)+")";
        }.bind(this))
        .text(function(d){
          return d.value;
        })
        .style("fill", function(d) {
            return this.color(d.symbol);
        }.bind(this));
};
