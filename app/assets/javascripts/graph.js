/*

  MAIN GRAPH MODULE DEFINITION

*/

DVE.Graph = function (data, graph_type) {
  this.data = data;
  this.graph_type = graph_type;
  this.margin = {top: 30, right: 20, bottom: 70, left: 50};
  this.width = 768 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.parseDate = d3.time.format("%b %Y").parse;
  this.x = d3.time.scale().range([0, this.width]);
  this.y = d3.scale.linear().range([this.height, 0]);
  this.xAxis = d3.svg.axis().scale(this.x)
      .tickFormat(d3.time.format("%m/%y"))
      .orient("bottom");
  this.yAxis = d3.svg.axis().scale(this.y)
      .ticks(data.entries.length/4)
      .orient("left");
  this.drawline = d3.svg.line()
                          .x(function(d) {
                            return this.x(d.date);
                          }.bind(this))
                          .y(function(d) {
                            return this.y(d.value);
                          }.bind(this));
  this.svg = d3.select("#graph")
      .append("svg")
          .attr("class", "chart")
          .attr("width", 775)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + this.margin.left + "," + this.margin.top + ")");
  this.charts = {
    cholesterol: function(){
      return new DVE.Graph.Cholesterol(this);
    }.bind(this),
    vitamin_d: function(){
      return new DVE.Graph.VitaminD(this);
    }.bind(this),
    tsh:function(){
      return new DVE.Graph.TSH(this);
    }.bind(this),
  };
  console.log(this.data.entries);
  this.data.entries.forEach(function(d) {
    d.date = this.parseDate(d.date);
    d.value = +d.value;
  }.bind(this));

  var minDate = new Date(this.data.entries[0].date.getFullYear()-1, this.data.entries[0].date.getMonth()+1,this.data.entries[0].date.getDate());
  var maxDate = new Date(this.data.entries[this.data.entries.length - 1].date.getFullYear()+1, this.data.entries[this.data.entries.length - 1].date.getMonth()+1,this.data.entries[this.data.entries.length - 1].date.getDate());

  this.x.domain([minDate, maxDate]);
  this.y.domain([d3.min(this.data.entries, function(d) { return d.value; })-75, d3.max(this.data.entries, function(d) { return d.value; })+75]);

};





