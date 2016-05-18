/*

  GRAPH SINGLE POINT DATA ON LINES

*/

DVE.Graph.prototype.organize_single_point_data = function (data, thresholds) {
  console.log(data, thresholds)
  var array = [
    [], [], [], []
  ]
  data.forEach(function(d,i){
    // console.log(d,i)

    // VALUE
    array[0].push(0)
    array[1].push(0)
    array[2].push(0)
    array[3].push(d.values[0].value)

    // CONTROL
    array[0].push(0)

    array[1].push((d.values[0].value - thresholds[d.key].under) > 0 ?
                    thresholds[d.key].under :
                    d.values[0].value)

    array[2].push((-thresholds[d.key].over + thresholds[d.key].under) > 0 ?
                    thresholds[d.key].under :
                    d.values[0].value)

    // if(thresholds[d.key].under === null){
    //   array[1].push(thresholds[d.key].over === null ? 0 : thresholds[d.key].over)
    // }
    // else{

    // }

    array[2].push((d.values[0].value - thresholds[d.key].over) > 0 ?
                    (thresholds[d.key].over === null ? 0 : thresholds[d.key].over) :
                    d.values[0].value)
    array[3].push((d.values[0].value - thresholds[d.key].over) > 0 ?
                  (d.values[0].value -thresholds[d.key].over)
                  : 0)
  })

  return array;
// [

      // return [0, (graph.data.entries[0].value - 8.1) > 0 ? 8.1 : graph.data.entries[0].value],
      //         [graph.data.entries[0].value, (graph.data.entries[0].value - 8.1) > 0 ? (graph.data.entries[0].value - 8.1) : 0]]
}
