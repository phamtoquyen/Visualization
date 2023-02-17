// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of cereal
    updateChart(category);
}

// recall that when data is loaded into memory, numbers are loaded as strings
// this function helps convert numbers into string during data preprocessing
function dataPreprocessor(row) {
    return {
        cerealName: row['Cereal Name'],
        manufacturer: row['Manufacturer'],
        sugar: +row['Sugars']
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = { t: 60, r: 20, b: 80, l: 60 };

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Variable for the spacing of bar charts
var barBand;
var barWidth;

// scales
var sugarScale; // y axis
var xBandScale; // x axis

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', `translate(${padding.l}, ${padding.t})`);

var data;

d3.csv('cereals.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and initialize the chart
    data = dataset;
    // Compute the spacing for bar bands based on number of cereals
    barBand = chartWidth / data.length;
    barWidth = 0.7 * barBand;

    // **** Your JavaScript code goes here ****
    //Add axes to chart
    addAxes();

    //Update the chart for All cereals to initialize
    updateChart('All');
});

function addAxes() {
    // **** Draw the axes here ****

    //x-axis
    xBandScale = d3.scaleBand()
          .range([10, chartWidth])
          .domain(data.map(function(d) { return d.cerealName; }))

    chartG
          .append('g')
          .attr("transform", "translate(0," + chartHeight +")")
          .call(d3.axisBottom(xBandScale))
          .attr('stroke-opacity', 0)
          .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");


    //y-axis
     var max = d3.max(data, function(d) { return d.sugar; }); // max value of sugar
     sugarScale = d3.scaleLinear()
      .domain([0, max])
      .range([chartHeight, 0]);

      chartG
      .append('g')
      .call(d3.axisLeft(sugarScale));

      //chart title
      svg.append('text')
          .attr('class', 'title')
          .attr('transform','translate(220,30)')
          .text('Sugars in Cereals')
          .style("font-size", "20px")
}

function updateChart(manufacturer) {
    //  Create a filtered array of cereals based on the manufacturer
    var cereals;
    if (manufacturer === 'All')
        cereals = data.filter(d => d.manufacturer !== manufacturer);
    else cereals = data.filter(d => d.manufacturer === manufacturer);

    // **** Draw and Update your chart here ****
    chartG.selectAll('.bar')
        .data(cereals)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xBandScale(d.cerealName); })
        .attr("y", function(d) { return sugarScale(d.sugar); })
        .attr("width", barWidth)
        .attr("height", function(d) { return chartHeight - sugarScale(d.sugar); })
        .attr("fill", "blue")
}

// Remember code outside of the data callback function will run before the data loads