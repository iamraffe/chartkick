/*

  CHART INTERVENTIONS

*/

DVE.Graph.prototype.draw_interventions = function () {

  console.log("DRAWING INTERVENTIONS");

  if(this.data.interventions.length>0){
    this.mount_sidebar(this.data.interventions)

  var x = d3.time.scale().range([0, this.width]);

  var y = d3.scale.linear();

  var color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);

    // // Scale the range of the data
    var minDate = this.data.entries[0].date;
    var maxDate = this.data.entries[this.data.entries.length - 1].date;

    x.domain([
      new Date(minDate.getFullYear()-1, minDate.getMonth()+1,minDate.getDate()),
      new Date(maxDate.getFullYear()+1, maxDate.getMonth()+1,maxDate.getDate())
    ]);

    // x.domain(d3.extent(this.data.entries, function(d) { return d.date; }));

    y.domain([d3.min(this.data.entries, function(d) { return d.value; }), d3.max(this.data.entries, function(d) { return d.value; })]);

    function left_border(d){
      return x(d.start) < x(minDate) ? x(minDate) : x(d.start);
    }

    function right_border(d){
      return x(d.end) > x(maxDate) ? x(maxDate) : x(d.end);
    }

        var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;
        this.data.interventions.forEach(function(d) {
          d.start = parseInterventionDate(d.start);
          d.end = parseInterventionDate(d.end);
          d.title = d.title;
          d.description = d.description;
        });
        var svg = this.svg;
        var rect = svg.selectAll("interventions").data(this.data.interventions);
        var rectEnter = rect.enter().append("rect");

        rectEnter.style("opacity", 0.1)
        .attr('width', function(d,i){
          // var start,end;
          // start = x(d.start) < x(minDate) ? x(minDate) : x(d.start);
          // end = x(d.end) > x(maxDate) ? x(maxDate) : x(d.end);
          // return end - start;
          return right_border(d) - left_border(d);
        }.bind(this))
        .attr('x', function(d) {
            // console.log(x(d.start), this.margin.left)
            // return x(d.start);
            // return x(d.start) < x(minDate) ? x(minDate) : x(d.start);
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
          .data(this.data.interventions)
          .enter()
          .append("text")
          .html(function(d){
            // console.log(d.title);
            return d.title+" - "+d.description;
          })
          .style("opacity", 1)
          .attr('x', function(d) {
              // return x(d.start)+10;
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
          // .attr('width', function(d,i){
          //   // console.log(x(d.end)-x(d.start));
          //     return x(d.end)-x(d.start);
          // }.bind(this))
          .attr("fill", "black");
    // var parseInterventionDate = d3.time.format("%Y-%m-%d").parse;

    // this.data.interventions.forEach(function(d) {
    //   d.start = d3.max([parseInterventionDate(d.start), this.data.entries[0].date]);
    //   d.end = d3.min([parseInterventionDate(d.end), this.data.entries[this.data.entries.length - 1].date]);
    //   d.title = d.title;
    //   d.type = d.type;
    //   d.id = d.id;
    //   d.description = d.description;
    //   d.index = d.index;
    // }.bind(this));

    // this.svg.selectAll('.chart')
    //   .data(this.data.interventions)
    //   .enter()
    //   .append('rect')
    //   .style("opacity", 0.1)
    //   .attr('width', function(d,i){
    //     return Math.abs(this.x(d.end)-this.x(d.start));
    //   }.bind(this))
    //   .attr('x', function(d) {
    //       return this.x(d.start);
    //   }.bind(this))
    //   .attr('y', function(d,i){
    //     // console.log(d);
    //     return 75 +(25*d.index);
    //   })
    //   .attr('height', function(d,i) {
    //     return this.height-75-(25*d.index)
    //   }.bind(this))
    //   .attr("class", function(d,i){
    //     return "interventions intervention--type--"+d.type+" intervention-"+d.id;
    //   })
    //   .attr("fill", function(d){
    //     console.log(this.color);
    //       return this.color(this.x(d.end)-this.x(d.start));
    //   }.bind(this));

    // this.svg.selectAll('.chart')
    //   .data(this.data.interventions)
    //   .enter()
    //   .append("text")
    //   .html(function(d){
    //     // console.log(d);
    //     return d.title+" - "+d.description;
    //   })
    //   .style("opacity", 1)
    //   .attr('x', function(d) {
    //       return this.x(d.start)+5;
    //   }.bind(this))
    //   .attr('y', function(d,i){
    //         return 50+(25*d.index);
    //   })
    //   .attr("class", function(d){
    //     return "intervention-text intervention--type--"+d.type+" intervention-text-"+d.id;
    //   })
    //   .style('font-family', '"Trebuchet MS", Helvetica, sans-serif')
    //   .style("font-weight", "bold")
    //   .style("text-transform", "uppercase")
    //   .style('background-color', 'red')
    //   .attr("fill", "black");

  }
};