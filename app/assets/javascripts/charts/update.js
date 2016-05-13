$(document).on("click", "#edit-chart-values", function () {
  $(".manual-input").parent().slideToggle();
});

$(document).on("click", "#update-chart-values", function () {
  $(".manual-input").parent().slideToggle();
});

/*

  GRAPH UPDATE FUNCTION

*/

DVE.Graph.prototype.update_chart = function (data) {
  console.log("DATA =>", data.entries);
  data.entries.forEach(function(d) {
    var date = this.parseDate(d.date);
    this.date_axis.push(date);
    d.date = date;
    d.value = +d.value;
  }.bind(this));

  this.svg.select('.path')
          .datum(data.entries)
          .transition()
          .duration(750)
          .attr("d", this.drawline);

  // data.entries.forEach(function(d,i){
  //   console.log(this.svg.selectAll('[data-index='+i+']'))
  // });
  // 

  // console.log(data.entries.reverse())

this.svg.selectAll(".label")
      .data(data.entries)
          .transition()
          .duration(750)
      .attr("transform", function(d, i) { return "translate(" + this.x(d.date) + "," + this.y(d.value) + ")"; }.bind(this));
  
  this.svg.selectAll('.text-values')
          .transition()
          .duration(750)
          .filter(function(d, i) {
            return i%2 != 0 
          })
          .text(function(d, i) { 
            console.log(d, data.entries[i].value)
            return data.entries[i].value; })
};
