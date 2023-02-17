var subgroups;
var groups;
var x;
var y;
var xSubgroup;
var data;
var color = d3.scaleOrdinal().domain(['FemaleDeaths', 'MaleDeaths']).range(["#3498db", "#e74c3c"])
var exclude = new Set()
var genderSet;

function onCategoryChanged() {
  var bigger = d3.select('#bigger').node();
  var category1 = bigger.options[bigger.selectedIndex].value;
  // Update chart with the selected category of count
  updateByCount(+category1);
}

// set the dimensions and margins of the graph
var margin = { top: 20, right: 40, bottom: 80, left: 50 }
var width = 800 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom

// append the svg object to the body of the page
var svg = d3.select("div").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "chart")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append main chart area to svg
let mainG = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

// Show the bars && Tooltip
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<span style='color:white'>" + d.key + " : " + d.value + "</span>";
  })
mainG.call(tip);

// Receive data and render chart's default display
d3.csv('TransportationFatalities_2020_ByAgeGender_postoncanvas.csv').then(function (dataset) {

  // Parse the Data
  dataset.pop();
  data = dataset
  for (var i = 0; i < data.length; ++i) {
    data[i].FemaleDeaths = Number(data[i].FemaleDeaths)
    data[i].MaleDeaths = Number(data[i].MaleDeaths);
  }
  
  subgroups = ['Male', 'Female']
  genderSet = new Set(subgroups)

  // list of groups by ages
  groups = d3.map(data, function (d) { return (d.Age) }).keys()
  //console.log(groups);

  // Add X axis
  x = d3.scaleBand()
    .domain(groups) // name of each group
    .range([0, width])
    .padding([0.2])

  mainG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class', 'xAxis')
    .call(d3.axisBottom(x).tickSize(6));

  // Add Y axis
  y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) {
      return (d.MaleDeaths < d.FemaleDeaths) ?
        (d.FemaleDeaths + 100) : (d.MaleDeaths + 100);
    })])
    .range([height, 0]);

  mainG.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position
  xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  makeChart();

});

// Render chart's default display
function makeChart() {
  var newData;
  newData = data
  let oldG = mainG.selectAll(".bar").data(newData, (d) => {
    return d.TotalDeaths
  })

  let newG = oldG.enter().append('g').attr('class', 'bar').attr('transform', (d) => {
    return `translate(${x(d.Age)}, 0)`
  })

  newG.selectAll('rect').data((d) => {
    return makeGroup(d)
  }).enter().append('rect')
  .attr('x', (d) => {return xSubgroup(d.key)})
  .attr('y', (d) => {return y(d.value)})
  .attr("height", function(d) { return height - y(d.value); })
  .attr("width", xSubgroup.bandwidth())
  .attr('fill', (d) => {return color(d.key)})
  .on('mouseover', tip.show)
  .on('mouseleave', tip.hide)

  newG.selectAll('text').data(makeGroup).enter()
  .append('text')
  .attr("x", function (d) { return xSubgroup(d.key); })
  .attr("y", function (d) {
    return y(d.value) - 8;
  })
  .attr("text-anchor", "start")
  .text(function (d) {
    return d.value;
  })
  .style('font-size', '0.6em');
}

// Filter data into a custom object
function makeGroup(d) {
  let l = ['MaleDeaths', 'FemaleDeaths']
  return l.map((e) => {return {key: e == 'MaleDeaths'? 'Male':'Female', value: +d[e]}})
}

// Update the chart based on count selected by user
function updateByCount(d) {
  let newData = data.filter((e) => {return e.FemaleDeaths > d && e.MaleDeaths > d})
  let newX = newData.map((d) => {return d.Age})
  x.domain(newX)
  mainG.select('.xAxis').call(d3.axisBottom(x).tickSize(6))
  xSubgroup.domain(subgroups).range([0, x.bandwidth()])
  exclude.clear()
  updateByGender('None')
  let oldG = mainG.selectAll('.bar').data(newData, (d) => {
    return d.Age
  })

  oldG.attr('transform', (d) => {
    return `translate(${x(d.Age)}, 0)`
  })

  oldG.selectAll('rect').data(makeGroup)
  .attr('x', (d) => {
    return xSubgroup(d.key)
  })
  .attr("width", xSubgroup.bandwidth())

  oldG.selectAll('text')
  .attr("x", function (d) { return xSubgroup(d.key); })
  .attr("y", function (d) {
    return y(d.value) - 8;
  })

  let newG = oldG.enter().append('g').attr('class', 'bar').attr('transform', (d) => {
    return `translate(${x(d.Age)}, 0)`
  })

  newG.selectAll().data(makeGroup).enter().append('rect')
  .attr('x', (d) => {return xSubgroup(d.key)})
  .attr('y', (d) => {return y(d.value)})
  .attr("height", function(d) { return height - y(d.value); })
  .attr("width", xSubgroup.bandwidth())
  .attr('fill', (d) => {return color(d.key)})
  .on('mouseover', tip.show)
  .on('mouseleave', tip.hide)

  newG.selectAll('text').data(makeGroup).enter()
  .append('text')
  .attr("x", function (d) { return xSubgroup(d.key); })
  .attr("y", function (d) {
    return y(d.value) - 8;
  })
  .attr("text-anchor", "start")
  .text(function (d) {
    return d.value;
  })
  .style('font-size', '0.6em');

  oldG.exit().remove()

}

// Update chart based on gender selected by user
function updateByGender(gender) {
  if (genderSet.has(gender) && !exclude.has(gender)) {
    exclude.add(gender)
    if (exclude.size == subgroups.length) exclude.clear()
  } else {
    exclude.delete(gender)
  }

  xSubgroup.domain(exclude.size == 0? subgroups: Array.from(exclude))

  let currentRect = mainG.selectAll('.bar').selectAll('rect').data(makeGroup)
  let currentText = mainG.selectAll('.bar').selectAll('text').data(makeGroup)

  currentRect.filter((d) => {
    return exclude.has(d.key)
  })
  .attr('width', 0)
  .attr('height', 0)
  .attr('y', height)

  currentText.filter((d) => {
    return exclude.has(d.key)
  })
  .text('')

  currentRect.filter(function(d) {
    return !exclude.has(d.key)
  })
  .transition()
  .attr("x", function(d) { return xSubgroup(d.key); })
  .attr("y", function(d) { return y(d.value); })
  .attr("height", function(d) { return height - y(d.value); })
  .attr("width", xSubgroup.bandwidth())
  .attr("fill", function(d) { return color(d.key); })
  .duration(500);

  currentText.filter((d) => {
    return !exclude.has(d.key)
  })
  .text((d) => {return d.value})
  .attr("x", function (d) { return xSubgroup(d.key); })
  .attr("y", function (d) {
    return y(d.value) - 8;
  })

  legend.selectAll('rect').style("fill",(d) => {
    return exclude.has(d) ? 'white': color(d)
  })
}


//x-axis Title
mainG.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + (height - 15) + ")")
  .append("text")
  .attr("y", 60)
  .attr("x", (width / 2) - 40)
  .style("font-size", 12)
  .style("text-transform", "uppercase")
  .style("opacity", .8)
  .text("AGE GROUPS");

// Labels your y axis and formats it
mainG.append("g")
  .attr("class", "y axis")
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 5)
  .attr("dy", "-5em")
  .attr("x", 30 - height / 2)
  .style("text-anchor", "end")
  .style("font-size", 12)
  .style("text-transform", "uppercase")
  .style("opacity", .8)
  .text("Death counts");


var LABELS = ["Male", "Female"]
//Legend
var legend = svg.selectAll(".legend")
  .data(LABELS)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
  .style("opacity", "0");

svg.append('text').text('Check or uncheck either gender box to unhide or hide the columns respectively')
.attr('transform', 'translate(198,-8)')

legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 15)
  .attr("height", 15)
  .style("fill", function (d) { return color(d) })
  .attr("stroke", (d) => {return color(d)})
  .attr("stroke-width",3)
  .on('click', (d) => updateByGender(d))


legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function (d) { return d; });
legend.transition().duration(300).delay(function (d, i) { return 200 * i; }).style("opacity", "1");
