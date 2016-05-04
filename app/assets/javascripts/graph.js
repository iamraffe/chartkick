/*

  MAIN GRAPH MODULE DEFINITION

*/

DVE.Graph = function (data, graph_type) {
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
    white_cell:function(){
      return new DVE.Graph.WhiteCell(this);
    }.bind(this),
    vitamin_b12:function(){
      return new DVE.Graph.VitaminB12(this);
    }.bind(this),
    viral_load:function(){
      return new DVE.Graph.ViralLoad(this);
    }.bind(this),
    testosterone:function(){
      return new DVE.Graph.Testosterone(this);
    }.bind(this),
    red_cell:function(){
      return new DVE.Graph.RedCell(this);
    }.bind(this),
    mercury:function(){
      return new DVE.Graph.Mercury(this);
    }.bind(this),
    iron:function(){
      return new DVE.Graph.Iron(this);
    }.bind(this),
    hemoglobin_a1c:function(){
      return new DVE.Graph.HemoglobinA1C(this);
    }.bind(this),
    folate:function(){
      return new DVE.Graph.Folate(this);
    }.bind(this),
    ferritin:function(){
      return new DVE.Graph.Ferritin(this);
    }.bind(this),
    copper:function(){
      return new DVE.Graph.Copper(this);
    }.bind(this),
    calcium:function(){
      return new DVE.Graph.Calcium(this);
    }.bind(this),
    alt:function(){
      return new DVE.Graph.ALT(this);
    }.bind(this),
    afp:function(){
      return new DVE.Graph.AFP(this);
    }.bind(this),
    insulin:function(){
      return new DVE.Graph.Insulin(this);
    }.bind(this),
    uric_acid:function(){
      return new DVE.Graph.UricAcid(this);
    }.bind(this),
    creatine:function(){
      return new DVE.Graph.Creatine(this);
    }.bind(this),
    systolic_blood_pressure:function(){
      return new DVE.Graph.SystolicBloodPressure(this);
    }.bind(this),
    diastolic_blood_pressure:function(){
      return new DVE.Graph.DiastolicBloodPressure(this);
    }.bind(this),
  };

  this.data = data;
  this.graph_wrapper = "#graph";
  this.graph_type = graph_type;
  this.margin = {top: 75, right: 25, bottom: 75, left: 25};
  this.width = 570 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.parseDate = d3.timeParse("%b %Y");
  this.x = d3.scaleTime().range([0, this.width]);
  this.y = d3.scaleLinear().range([this.height, 0]);
  this.xAxis = d3.axisBottom(this.x)
      .tickFormat(d3.timeParse("%m/%y"));
  this.yAxis = d3.axisLeft(this.y)
      .ticks(data.entries.length/4);
  this.drawline = d3.line()
                          .x(function(d) {
                            return this.x(d.date);
                          }.bind(this))
                          .y(function(d) {
                            return this.y(d.value);
                          }.bind(this));
  this.svg = d3.select("#graph")
      .append("svg")
          .attr("class", "chart")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + this.margin.left+ "," +  this.margin.top  + ")");

  this.date_axis = [];

  // console.log(this.data.entries);
  this.data.entries.forEach(function(d) {

    var date = this.parseDate(d.date);
    this.date_axis.push(date);
    d.date = date;
    d.value = +d.value;
  }.bind(this));

  console.log(this.date_axis)

  var minDate = new Date(this.data.entries[0].date.getFullYear()-1, this.data.entries[0].date.getMonth()+1,this.data.entries[0].date.getDate());
  var maxDate = new Date(this.data.entries[this.data.entries.length - 1].date.getFullYear()+1, this.data.entries[this.data.entries.length - 1].date.getMonth()+1,this.data.entries[this.data.entries.length - 1].date.getDate());

  this.x.domain([minDate, maxDate]);
  this.y.domain([0, d3.max(this.data.entries, function(d) { return d.value; })+25]);

};





