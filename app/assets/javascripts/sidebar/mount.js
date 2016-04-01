/*

  MOUNT INTERVENTIONS MODAL SIDEBAR

*/

DVE.Graph.prototype.mount_sidebar = function (interventions) {

  console.log("SIDEBAR MOUNT ->", interventions)

  var intervention_cluster_by_type = d3.nest()
                    .key(function(d) {return d.type;})
                    .entries(interventions);

  intervention_cluster_by_type.forEach(function(d,i){

    var type = d.key;

    var interventions = d.values;

    $(' ul#added-'+type+'-interventions').html('');

    interventions.forEach(function(d,i){
      $(' ul#added-'+type+'-interventions').append(
                                              '<li class="animated"><span class="fa fa-pencil not-active" data-index="'+
                                                i.toString()+
                                                '" data-id="'+d.id+
                                                '"></span><span class="added-title">'+d.title+'</span> - <span class="added-description">'+
                                                d.description+'</span><span class="added-dates">(<span class="added-date-start">'+
                                                d.start+
                                                '</span> - <span class="added-date-end">'+d.end+
                                              '</span>)</span></li>'
        );
    });
  });

}