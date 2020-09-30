var margin = {left:90, top:90, right:90, bottom:90},
    width =  1000 - margin.left - margin.right, // more flexibility: Math.min(window.innerWidth, 1000)
    height =  1000 - margin.top - margin.bottom, // same: Math.min(window.innerWidth, 1000)
    innerRadius = Math.min(width, height) * .39,
    outerRadius = innerRadius * 1.1;

  var names = ["Test1","Test2","AMO-DB","YouTube","Twitter", "Google+", "Pflegeratgeber" ,"O-Mag","RuV"],
    colors = ["#301E1E", "#083E77", "#342350", "#567235", "#8B161C", "#DF7C00"],
    opacityDefault = 0.8;

  var matrix = [
[0, 7, 37, 76, 50, 54, 39, 51, 15, 24, 25, 8, 9, 4, 0, 0, 0, 9, 16, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 30],
[0, 11, 19, 32, 19, 29, 11, 15, 10, 2, 3, 5, 3, 5, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 8, 30, 11, 14, 13, 5, 9, 5, 0, 3, 4, 0, 1, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[0, 10, 11, 4, 16, 20, 6, 6, 4, 3, 0, 6, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 16, 2, 6, 9, 2, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[0, 0, 2, 6, 4, 2, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 12, 11, 11, 13, 16, 4, 6, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[0, 7, 0, 2, 3, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //Thor //Thor
  ];

  ////////////////////////////////////////////////////////////
  /////////// Create scale and layout functions //////////////
  ////////////////////////////////////////////////////////////

  var colors = d3.scaleOrdinal()
      .domain(d3.range(names.length))
    .range(colors);

  var chord = d3.chord()
    .padAngle(.15)
    .sortChords(d3.descending)

    var arc = d3.arc()
    .innerRadius(innerRadius*1.01)
    .outerRadius(outerRadius);

  var path = d3.ribbon()
  .radius(innerRadius);

////////////////////////////////////////////////////////////
////////////////////// Create SVG //////////////////////////
////////////////////////////////////////////////////////////

var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
  .datum(chord(matrix));

////////////////////////////////////////////////////////////
////////////////// Draw outer Arcs /////////////////////////
////////////////////////////////////////////////////////////

var outerArcs = svg.selectAll("g.group")
  .data(function(chords) { return chords.groups; })
  .enter().append("g")
  .attr("class", "group")
  .on("mouseover", fade(.1))
  .on("mouseout", fade(opacityDefault))

  // text popups
  .on("click", mouseoverChord)
  .on("mouseout", mouseoutChord);

outerArcs.append("path")
  .style("fill", function(d) { return colors(d.index); })
  .attr("id", function(d, i) { return "group" + d.index; })
  .attr("d", arc);
  
 outerArcs.append("text")
         .attr("x", 6)
        .attr("dy", 15)
      .append("textPath")
        .attr("xlink:href", function(d) { return "#group" + d.index; })
        .text(function(chords, i){return names[i];})
        .style("fill", "white");
  

////////////////////////////////////////////////////////////
////////////////////// Append names ////////////////////////
////////////////////////////////////////////////////////////

//Append the label names on the outside
outerArcs.append("text")
  .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
  .attr("dy", ".35em")
  .attr("class", "titles")
  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
  .attr("transform", function(d) {
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
    + "translate(" + (outerRadius + 10) + ")"
    + (d.angle > Math.PI ? "rotate(180)" : "");
  })
  .text(function(d,i) { return names[i]; });
  
////////////////////////////////////////////////////////////
////////////////// Draw inner chords ///////////////////////
////////////////////////////////////////////////////////////

svg.selectAll("path.chord")
  .data(function(chords) { return chords; })
  .enter().append("path")
  .attr("class", "chord")
  .style("fill", function(d) { return colors(d.source.index); })
  .style("opacity", opacityDefault)
  .attr("d", path);

////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

function popup() {
  return function(d,i) {
    console.log("love");
  };
}//popup

//Returns an event handler for fading a given chord group.
function fade(opacity) {
  return function(d,i) {
    svg.selectAll("path.chord")
        .filter(function(d) { return d.source.index != i && d.target.index != i; })
    .transition()
        .style("opacity", opacity);
  };
}//fade

  //Highlight hovered over chord
function mouseoverChord(d,i) {

  //Decrease opacity to all
  svg.selectAll("path.chord")
    .transition()
    .style("opacity", 0.1);
  //Show hovered over chord with full opacity
  d3.select(this)
    .transition()
        .style("opacity", 1);

  //Define and show the tooltip over the mouse location
  $(this).popover({
    //placement: 'auto top',
    title: 'test',
    placement: 'right',
    container: 'body',
    animation: false,
    offset: "20px -100px",
    followMouse: true,
    trigger: 'click',
    html : true,
    content: function() {
      return "<p style='font-size: 11px; text-align: center;'><span style='font-weight:900'>"  +
           "</span> text <span style='font-weight:900'>"  +
           "</span> folgt hier <span style='font-weight:900'>" + "</span> movies </p>"; }
  });
  $(this).popover('show');
}
//Bring all chords back to default opacity
function mouseoutChord(d) {
  //Hide the tooltip
  $('.popover').each(function() {
    $(this).remove();
  })
  //Set opacity back to default for all
  svg.selectAll("path.chord")
    .transition()
    .style("opacity", opacityDefault);
  }      //function mouseoutChord