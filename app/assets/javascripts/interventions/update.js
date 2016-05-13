/*

  ADD INTERVENTION TO CHARTS

*/

DVE.Graph.prototype.update_intervention = function (data) {

  // console.log(this.number_of_symbols < this.data.entries.length)

  console.log("DATA =>",data)

  console.log("UPDATING INTERVENTION!")

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



    // Select the section we want to apply our changes to
    var svg = this.svg;

    data.forEach(function(intervention, index) {

      intervention.start = parseInterventionDate(intervention.start);
      intervention.end = parseInterventionDate(intervention.end);
      intervention.title = intervention.title;
      intervention.description = intervention.description;

      console.log(this.number_of_symbols < this.data.entries.length)

      if(this.number_of_symbols < this.data.entries.length){

        svg.select('.intervention-'+intervention.id)
            .transition()
            .duration(750)
            .attr('x1', function() {
              return left_border(intervention);
              // return x(intervention.start)+50;
            })
            .attr('x2', function() {
              return left_border(intervention);
              // return x(intervention.start)+50;
            });
            // .transition()
            // .duration(1500)
            // .attr("width", function(){
            //   return right_border(intervention) - left_border(intervention);
            //     // return x(intervention.end)-x(intervention.start);
            // });


        svg.select('.intervention-bg-'+intervention.id)
            .transition()
            .duration(750)
            .attr('x', function() {
              return left_border(intervention);
              // return left_border(intervention);
              // return x(intervention.start)+50;
            })
            // .attr('x2', function() {
            //   return left_border(intervention);
            //   // return x(intervention.start)+50;
            // });
            .transition()
            .duration(1500)
            .attr("width", function(){
              return right_border(intervention) - left_border(intervention);
                // return x(intervention.end)-x(intervention.start);
            });

        svg.select(".intervention-text-"+intervention.id)
            .transition()
            .duration(750)
            .attr('x', function() {
              return left_border(intervention)+5;
              // return parseInt(x(intervention.start))+50;
            })
            // .transition()
            // .duration(1500)
            // .attr("width", function(){
            //   eturn right_border(intervention) - left_border(intervention);
            //     // return x(intervention.end)-x(intervention.start);
            // })
            .transition()
            .duration(1500)
            .text(function(){
              return intervention.title+" - "+intervention.description;
            });
      }
      else{
        // console.log(svg)
        svg.select('.intervention-'+intervention.id)
            .html(function(d){
              return d.type.capitalize()+"<br>: "+d.title.capitalize(true)+" - "+d.description.capitalize(true);
            });
      }
    }.bind(this));













}
