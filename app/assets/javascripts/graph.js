DVE.Graph = function (data) {
  this.data = data;
  this.margin = {top: 30, right: 20, bottom: 70, left: 50};
  this.width = 768 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  this.parseDate = d3.time.format("%b %Y").parse;

  this.th =d3.scale.ordinal().range([130, 40, 150, 160]);
  this.thd =d3.scale.ordinal().domain([130, 40, 150, 160]);

  this.x = d3.time.scale().range([0, this.width]);
  this.y = d3.scale.linear().range([this.height, 0]);

  this.xAxis = d3.svg.axis().scale(this.x)
      .tickFormat(d3.time.format("%m/%y"))
      .orient("bottom");

  this.yAxis = d3.svg.axis().scale(this.y)
      .ticks(data.entries.length/4)
      .orient("left");

  this.priceline = d3.svg.line()
      .x(function(d) { return this.x(d.date); })
      .y(function(d) { return this.y(d.value); });

  this.svg = d3.select("#graph")
      .append("svg")
          .attr("class", "chart")
          .attr("width", 775)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + this.margin.left + "," + this.margin.top + ")");
  this.render();
};

DVE.Graph.prototype.render = function () {
  console.log(this.data);
  this.draw_gauge();
};

DVE.Graph.prototype.draw_single = function () {

};

DVE.Graph.prototype.draw_multi = function () {

};

DVE.Graph.prototype.draw_interventions = function () {

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