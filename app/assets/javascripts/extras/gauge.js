/*

  GAUGE

*/

DVE.Graph.prototype.draw_gauge = function () {
  var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, el, endPadRad, height, i, margin, needle, numSections, padRad, percToDeg, percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad, svg, totalPercent, width;

  // var entries = this.data.entries;

  // var dataNest = d3.nest()
  //     .key(function(d) {return d.symbol;})
  //     .entries(entries);

  // var hdl = dataNest[1].values[dataNest[1].values.length-1].value;

  // var cholesterol = dataNest[3].values[dataNest[3].values.length-1].value;

  // percent = (cholesterol/hdl)/10;

  barWidth = 2;

  numSections = 5;

  sectionPerc = 1 / numSections / 2;

  padRad = 0.05;

  chartInset = 10;

  totalPercent = .75;

  el = this.svg;

  // margin = {
  //   top: 20,
  //   right: 20,
  //   bottom: 30,
  //   left: 20
  // };

  // width = el[0][0].offsetWidth - margin.left - margin.right;
  width = 100;
  height = width;

  radius = Math.min(width, height) / 2;

  // console.log("RAD", radius)

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

  chart = el.append('g').attr("id", "gauge").attr('opacity', 0).attr('transform', "translate(" + 485 + ", " + 410 + ")");

  for (sectionIndx = i = 1, ref = numSections; 1 <= ref ? i <= ref : i >= ref; sectionIndx = 1 <= ref ? ++i : --i) {
    arcStartRad = percToRad(totalPercent);
    arcEndRad = arcStartRad + percToRad(sectionPerc);
    totalPercent += sectionPerc;
    startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
    endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
    arc = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);
    // var color = d3.scale.ordinal().range(['#111A33', '#001E93', '#4FCFEB', '#A725A7'])
    chart.append('path').attr('class', "arc chart-color" + sectionIndx).attr('d', arc).attr("stroke", function(){
      // console.log(sectionIndx)
      return ['#F02828', '#FE6A00', '#FFD800', '#82E042', '#089F50'][sectionIndx-1];
    });
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
      return el.transition().delay(500).ease('elastic').duration(2000).selectAll('.needle').tween('progress', function() {
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

  needle = new Needle(20, 1.5);

  needle.drawOn(chart, 0);

  // console.log(this.percent*10)

  needle.animateOn(chart, this.percent);

  GaugeText = (function() {
    function GaugeText() {
    }

    GaugeText.prototype.drawOn = function(el, perc) {
      return el.append('text').attr('class', 'gauge-text').text(perc).attr("x", 0).attr("y", 25).style('font-family', '"Trebuchet MS", Helvetica, sans-serif').style("text-anchor", "middle").style("font-weight", "bold").style("font-size", "12px");
    };

    return GaugeText;
  })();

  gauge_text = new GaugeText();

  gauge_text.drawOn(chart, (this.percent*10).toFixed(2));
};
