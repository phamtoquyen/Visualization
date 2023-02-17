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
var sugarScale;
var xBandScale;

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

    //y-axis
    sugarScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.sugar; })])
    .range([chartHeight, 0]);
    //Title
     svg.append('text')
        .attr('class', 'title')
        .attr('transform','translate(220,30)')
        .text('Sugars in Cereals')
        .style("font-size", "20px")

     svg.append('g')
         .attr('class', 'y axis')
         .attr('transform', 'translate('+[padding.l, padding.t]+')')
        .call(d3.axisLeft(sugarScale));


     updateChart('All');
});


var list;
function updateChart(manufacturer) {
    var cereals;
    //  Create a filtered array of cereals based on the manufacturer
    if (manufacturer === 'All')
        cereals = data.filter(d => d.manufacturer !== manufacturer);
    else cereals = data.filter(d => d.manufacturer === manufacturer);
    list = cereals;
    // **** Draw and Update your chart here ****

    var bars = chartG.selectAll('.bar')
        .data(cereals, function(d){
            return d.manufacturer;
        });

    var barsEnter = bars.enter() // Remember enter makes a placeholder for new elements
            .append('g')
            .attr('class', 'bar');
    //moving the bars.
    bars.merge(barsEnter)
        .attr('transform', (d, i) => {
            return 'translate('+[i * barBand + 10, sugarScale(d.sugar)]+')';
    })

    barsEnter.append('rect')
        .attr('width', barWidth)
        .attr('height', function(d){
            return chartHeight - sugarScale(d.sugar);
        })
        .attr("fill", "blue");


    barsEnter.append('text')
        .attr("transform","rotate(-45)")
        .attr('transform', (d, i) => {
            return 'translate('+[barBand - 10, chartHeight - sugarScale(d.sugar) + 10]+')rotate(-45)';
        })
        .text(function(d){
            return d.cerealName;
        })
        .style('text-anchor', 'end')
        .style("font-size", "12px")
        .style('fill', 'black')

    bars.exit().remove();
}


 var value;
 d3.select('#main')
    .append('p')
    .append('button')
    .style("border", "1px solid black")
    .text('Filter Data')
    .on('click', function() {
        var cutoffValue = document.getElementById('cutoff').value;
        list = list.filter((d) => d.sugar >= cutoffValue);
        d3.select("svg").selectAll('.bar').remove();

        var bars = chartG.selectAll('.bar')
            .data(list, function(d){
                return d;
            });

        var barsEnter = bars.enter() // Remember enter makes a placeholder for new elements
            .append('g')
            .attr('class', 'bar');

        bars.merge(barsEnter)
            .attr('transform', (d, i) => {
                return 'translate('+[i * barBand + 10, sugarScale(d.sugar)]+')';
            })

        barsEnter.append('rect')
                .attr('width', barWidth)
                .attr('height', function(d){
                    return chartHeight - sugarScale(d.sugar);
                })
                .attr("fill", "blue");

        barsEnter.append('text')
                .attr("transform","rotate(-45)")
                .attr('transform', (d, i) => {
                    return 'translate('+[barBand - 10, chartHeight - sugarScale(d.sugar) + 10]+')rotate(-45)';
                })
                .text(function(d){
                    return d.cerealName;
                })
                .style('text-anchor', 'end')
                .style("font-size", "12px")
                .style('fill', 'black')

            bars.exit().remove();
    });

// Remember code outside of the data callback function will run before the data loads