/*

  UPDATE INTERVENTIONS MODAL SIDEBAR

*/

DVE.Graph.prototype.update_sidebar = function (interventions, type) {
  console.log("UPDATING SIDEBAR!")

  console.log(interventions)

  function parse_date(string_date){

    var date = new Date(string_date)

    var year = date.getFullYear()

    var month = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);

    var day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();

    return year+"-"+month+"-"+day;

  }

  $(' ul#added-'+type+'-interventions').html('');

  interventions.forEach(function(d,i){

    var start = parse_date(d.start)

    var end = parse_date(d.end)

    $(' ul#added-'+type+'-interventions').append('<li class="animated flash"><span class="fa fa-pencil not-active" data-index="'+i.toString()+'" data-id="'+d.id+'"></span><span class="added-title">'+d.title.capitalize(true)+'</span> - <span class="added-description">'+d.description+'</span><span class="added-dates">(<span class="added-date-start">'+start+'</span> - <span class="added-date-end">'+end+'</span>)</span></li>');
  });


};
