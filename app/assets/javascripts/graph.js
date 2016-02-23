DVE.Graph = function (data, graph_type) {
  this.data = data;
  this.graph_type = graph_type;
  this.margin = {top: 30, right: 20, bottom: 70, left: 50};
  this.width = 768 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  this.parseDate = d3.time.format("%b %Y").parse;

  this.th = d3.scale.ordinal().range([130, 40, 150, 160]);
  this.thd = d3.scale.ordinal().domain([130, 40, 150, 160]);

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
      this.number_of_symbols = 4
      this.color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7']);
      return new DVE.Graph.Cholesterol(this);
    }.bind(this),
    vitamin_d: function(){
      return new DVE.Graph.VitaminD(this);
    }.bind(this),
    tsh:function(){
      return new DVE.Graph.TSH(this);
    }.bind(this),
  };

  this.data.entries.forEach(function(d) {
    d.date = this.parseDate(d.date);
    d.value = +d.value;
  }.bind(this));

  var minDate = new Date(this.data.entries[0].date.getFullYear()-1, this.data.entries[0].date.getMonth()+1,this.data.entries[0].date.getDate());
  var maxDate = new Date(this.data.entries[this.data.entries.length - 1].date.getFullYear()+1, this.data.entries[this.data.entries.length - 1].date.getMonth()+1,this.data.entries[this.data.entries.length - 1].date.getDate());

  this.x.domain([minDate, maxDate]);
  this.y.domain([d3.min(this.data.entries, function(d) { return d.value; })-75, d3.max(this.data.entries, function(d) { return d.value; })+75]);
};

DVE.Graph.Cholesterol = function(graph){
  graph.draw_multi();
  graph.draw_gauge();
};

DVE.Graph.prototype.render = function () {
  this.draw_interventions();
  this.charts[this.graph_type](this.data);
  // Add the X Axis
  this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

  // Add the Y Axis
  this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);
  // Add Axis text
  this.svg.selectAll('.axis text')
            .style('fill', 'black')
            .style('stroke-width', 0)
            .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');
  // Add Axis path
  this.svg.selectAll('.axis path')
            .style('stroke', 'black')
            .style('fill', 'none')
            .style('stroke-width', 2);

  // Add the dots
  this.svg.selectAll('.dots')
      .data(this.data.entries)
      .enter()
      .append("g")
      .attr("class", function(d, i){
        return 'dots tag'+ d.symbol.replace(/\s+/g, '')
      })
      .attr('clip-path', "url(#clip)")
      .append('circle')
      .attr("r", 5)
      .attr('fill', function(d,i){
        if((d.symbol !== "HDL" && this.th(d.symbol) < d.value) || (d.symbol === "HDL" && this.th(d.symbol) > d.value)){
          return "#fff";
        }
        else{
          return d.color = this.color(d.symbol);
        }
      }.bind(this))
      .attr('stroke', function(d,i){
        return this.color(d.symbol);
      }.bind(this))
      .attr("transform", function(d) {
        return "translate("+this.x(d.date)+","+this.y(d.value)+")";
      }.bind(this));

    // Add the text
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
        // .attr('class', 'text-values')
        .attr("transform", function(d) {
          if(d.symbol === 'HDL' || d.symbol === 'LDL'){
            return "translate("+(this.x(d.date)-7.5)+","+(this.y(d.value)+20)+")";
          }
          else{
            return "translate("+(this.x(d.date)-7.5)+","+(this.y(d.value)-10)+")";
          }
        }.bind(this))
        .text(function(d){
          return d.value;
        })
        .style("fill", function(d) { // Add the colours dynamically
            return this.color(d.symbol);
        }.bind(this));
        // .call(this.drag);
};

DVE.Graph.prototype.draw_single = function () {
  console.log("DRAWING MULTILINE");

};

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

  this.minDate = new Date(this.data.entries[0].date.getFullYear()-1, this.data.entries[0].date.getMonth()+1,this.data.entries[0].date.getDate());
  this.maxDate = new Date(this.data.entries[this.data.entries.length - 1].date.getFullYear()+1, this.data.entries[this.data.entries.length - 1].date.getMonth()+1,this.data.entries[this.data.entries.length - 1].date.getDate());
  this.legendSpace = this.width/this.dataNest.length; // spacing for the legend
  this.th = d3.scale.ordinal().range([130, 40, 150, 160]);
  this.thd = d3.scale.ordinal().domain([130, 40, 150, 160]);
  this.dataNest.forEach(function(d,i) {
      
      this.svg.append("clipPath")
            .attr("id", "clip-"+d.key+"-above")
            .append("rect")
              .attr("width", this.width)
              .attr("height", function(){
                return this.y(this.th(d.key));
              }.bind(this));

      this.svg.append("clipPath")
          .attr("id", "clip-"+d.key+"-below")
          .append("rect")
            .attr("y", this.y(this.th(d.key)))
            .attr("width", this.width)
            .attr("height", function(){
              return this.height - this.y(this.th(d.key));
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

DVE.Graph.prototype.draw_interventions = function () {
  console.log("DRAWING INTERVENTIONS");
};

DVE.Graph.prototype.draw_gauge = function () {
  var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, el, endPadRad, height, i, margin, needle, numSections, padRad, percToDeg, percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad, svg, totalPercent, width;

  var entries = this.data.entries;

  var dataNest = d3.nest()
      .key(function(d) {return d.symbol;})
      .entries(entries);

  var hdl = dataNest[1].values[dataNest[1].values.length-1].value;

  var cholesterol = dataNest[3].values[dataNest[3].values.length-1].value;

  percent = (cholesterol/hdl)/10;

  barWidth = 10;

  numSections = 5;

  sectionPerc = 1 / numSections / 2;

  padRad = 0.05;

  chartInset = 10;

  totalPercent = .75;

  el = this.svg;

  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 20
  };

  // width = el[0][0].offsetWidth - margin.left - margin.right;
  width = 200;
  height = width;

  radius = Math.min(width, height) / 2;

  percToDeg = function(perc) {
    return perc * 360;
  };

  percToRad = function(perc) {
    return degToRad(percToDeg(perc));
  };

  degToRad = function(deg) {
    return deg * Math.PI / 180;
  };

  // svg = el.append('svg').attr("id", "gauge").attr('opacity', 0).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

  // chart = el.append('g').attr("id", "gauge").attr('opacity', 0).attr("x", 550).attr("y", 250).attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");

  chart = el.append('g').attr("id", "gauge").attr('opacity', 0).attr('transform', "translate(" + 650 + ", " + 362.5 + ")");

  for (sectionIndx = i = 1, ref = numSections; 1 <= ref ? i <= ref : i >= ref; sectionIndx = 1 <= ref ? ++i : --i) {
    arcStartRad = percToRad(totalPercent);
    arcEndRad = arcStartRad + percToRad(sectionPerc);
    totalPercent += sectionPerc;
    startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
    endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
    arc = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);
    chart.append('path').attr('class', "arc chart-color" + sectionIndx).attr('d', arc);
  }

  Needle = (function() {
    function Needle(len, radius1) {
      this.len = len;
      this.radius = radius1;
    }

    Needle.prototype.drawOn = function(el, perc) {
      el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
      return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
    };

    Needle.prototype.animateOn = function(el, perc) {
      var self;
      self = this;
      return el.transition().delay(500).ease('elastic').duration(3000).selectAll('.needle').tween('progress', function() {
        return function(percentOfPercent) {
          var progress;
          progress = percentOfPercent * perc;
          return d3.select(this).attr('d', self.mkCmd(progress));
        };
      });
    };

    Needle.prototype.mkCmd = function(perc) {
      var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
      thetaRad = percToRad(perc / 2);
      centerX = 0;
      centerY = 0;
      topX = centerX - this.len * Math.cos(thetaRad);
      topY = centerY - this.len * Math.sin(thetaRad);
      leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
      leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
      rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
      rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
      return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
    };

    return Needle;

  })();

  needle = new Needle(60, 7.5);

  needle.drawOn(chart, 0);

  needle.animateOn(chart, percent);

  GaugeText = (function() {
    function GaugeText() {
    }

    GaugeText.prototype.drawOn = function(el, perc) {
      return el.append('text').attr('class', 'gauge-text').text(perc).attr("x", -50).attr("y", 55).style('font-family', '"Trebuchet MS", Helvetica, sans-serif').style("font-weight", "bold").style("font-size", "50px");
    };

    return GaugeText;
  })();

  gauge_text = new GaugeText();

  gauge_text.drawOn(chart, (percent*10).toFixed(2));
};