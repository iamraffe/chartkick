function slugify(name, type)
{
  name = name.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
  console.log(name, type)
  name = name.split("-")
  var date = new Date()

  return date.getFullYear().toString().substr(2,2)+
          "-"+
          (date.getMonth()+1).toString()+
          "_"+
          name[1]+
          "-"+
          name[0]+
          "-"+
          type;
}

function deleteName(){
 $('.patient-name-svg').remove();
}

/*

  GRAPH EXPORT FUNCTION

*/

DVE.Graph.prototype.export = function () {
  var name = $("#graph").attr('data-name');

  console.log("NAME => ", name)
  var type = $("#graph").parent().attr('data-type');

  console.log("TYPE => ", type)
  //ADD PATIENT NAME
  d3.select("svg")
    .append('text')
      .attr('class', 'patient-name-svg')
      .text(type.toUpperCase() + " CHART: " + name)
        // .attr("text-anchor", "middle")
        .attr('x', 75)
        .attr('y', 25)
        .style('fill', 'black')
        .style("font-weight", "bold")
        .style("font-size", 26)
        .style('font-family', '"Trebuchet MS", Helvetica, sans-serif');

  //SVG TO STRING
  var svg_data = (new XMLSerializer()).serializeToString(d3.select('svg').node());

  //PREPARE DATA FOR AJAX CALL
  var blob = {'authenticity_token': $('meta[name=csrf-token]').attr('content'), 'blob' : svg_data};

  $.ajax({
    type: "POST",
    url: '/charts/export/',
    dataType: "json",
    data: blob,
    success: function(response){
      var link = document.createElement('a');
      link.download = slugify(name, type)+".png";
      link.href= "data:image/svg+xml;base64," +  response.png;
      document.body.appendChild(link);
      link.click();
      deleteName();
    },
    error: function (error){
      console.log(error)
    }
  });
};
