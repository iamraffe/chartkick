$(document).on("click", "#edit-chart-values", function () {
  $(".manual-input").parent().slideToggle();
});

$(document).on("click", "#update-chart-values", function () {
  $(".manual-input").parent().slideToggle();
});

$(document).on("dblclick", ".database--input", function () {
  console.log("double click")
  alert("You are now editing a persisted value.")
  $(this).removeClass("disabled").removeAttr("disabled")
  // $(".manual-input").parent().slideToggle();
});

/*

  GRAPH UPDATE FUNCTION

*/

DVE.Graph.prototype.update_chart = function (data) {
  data.entries.forEach(function(d) {
    var date = this.parseDate(d.date);
    this.date_axis.push(date);
    d.date = date;
    d.value = +d.value;
  }.bind(this));

  var dataNest = d3.nest()
                    .key(function(d) {return d.symbol;})
                    .entries(data.entries);

  dataNest.forEach(function(data,index){

    if(data.values.length > 1){
      this.svg.selectAll('.line.tag'+data.key.replace(/\s+/g, ''))
              .datum(data.values)
              .transition()
              .duration(750)
              .attr("d", this.drawline);

      this.svg.selectAll('.label.tag'+data.key.replace(/\s+/g, ''))
          .data(data.values)
              .transition()
              .duration(750)
          .attr("transform", function(d, i) { return "translate(" + this.x(d.date) + "," + this.y(d.value) + ")"; }.bind(this));

      this.svg.selectAll('.label.tag'+data.key.replace(/\s+/g, '')+' .text-values')
              .filter(function(d, i) {
                return i%2 != 0
              })
              .text(function(d, i) {
                return data.values[i].value;
              })
              .filter(function(d, i) {
                return i == 0
              })
              .append("tspan")
                .attr("class", "label-key")
                .attr("x", -15)
                .attr("text-anchor", "end")
                .style("font-size", 12)
                .text(function(d) {
                  console.log(d)
                  return " " + d.symbol;
                });
    }
    else{
      console.log(data)
    }


  }.bind(this));

};
