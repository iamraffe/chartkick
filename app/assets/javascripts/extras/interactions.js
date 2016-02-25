$(document).ready(function(e){
  if($('#vitamin-d-session-graph').length > 0){
    drawVitaminDGraphFromSession();
  }
  if($('#tsh-session-graph').length > 0){
    drawVitaminDGraphFromSession();
  }
  // if($('#vitamin-d-db-graph').length > 0){
  //   drawVitaminDGraphFromDB();
  // }

  if($('#session-graph-container').length > 0){
    drawGraphFromSession();
  }
    d3.selectAll("[type=checkbox][name=visible_interventions]").on("change", function() {
      var selected = this.value;
      // console.log(this.value);
      var type = ".intervention--type--"+this.value;
      var opacity = this.checked ? 0.1 : 0;
      d3.selectAll(".interventions"+type)
          .transition().duration(500)
          .style("opacity", opacity);
      d3.selectAll(".intervention-text"+type)
          .transition().duration(500)
          .style("opacity", opacity*10);
    });

    d3.selectAll("[type=radio][name=optradio]").on("click", function() {
      if(this.value === "gauge"){
        d3.selectAll("#gauge")
            .transition().duration(500)
            .style("opacity", 1);

        d3.selectAll(".tagLDL")
            .transition().duration(500)
            .style("opacity", 0);

        d3.selectAll(".tagTRIGLYCERIDES")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagHDL")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagCHOLESTEROL")
            .transition().duration(500)
            .style("opacity", 1);
      }
      else if(this.value === "all"){
        d3.selectAll("#gauge")
            .transition().duration(500)
            .style("opacity", 0);

        d3.selectAll(".tagLDL")
            .transition().duration(500)
            .style("opacity", 1);

        d3.selectAll(".tagTRIGLYCERIDES")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagHDL")
            .transition().duration(500)
            .style("opacity", 1);
        d3.selectAll(".tagCHOLESTEROL")
            .transition().duration(500)
            .style("opacity", 1);
      }
      else if(this.value === "other"){
        d3.selectAll("#gauge")
            .transition().duration(500)
            .style("opacity", 0);

        d3.selectAll(".tagHDL")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagCHOLESTEROL")
            .transition().duration(500)
            .style("opacity", 0);
        d3.selectAll(".tagLDL")
            .transition().duration(500)
            .style("opacity", 1);

        d3.selectAll(".tagTRIGLYCERIDES")
            .transition().duration(500)
            .style("opacity", 1);
      }
    });

});