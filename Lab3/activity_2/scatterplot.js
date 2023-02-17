// **** Your JavaScript code goes here ****


d3.csv('NetflixOriginals.csv').then(function(dataset) {

    dataset.forEach(function(d) {
        //Convert String date into Object date
        var parser = d3.timeParse("%m/%d/%Y");
        d['Premiere'] = parser(d['Premiere']);
        //Convert String score into number score
        d['IMDB Score'] = +d['IMDB Score'];
    })

    var dots = d3.select("body").select("svg")
                .selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("cx", function(d){
                    return scaleDate(d['Premiere']);
                })
                .attr("cy", function(d, i){
                    return scaleIMDB(d['IMDB Score']);
                })
                .attr("r", 3.5)
                .style("fill", "blue")
                .style("opacity", 0.5);

    d3.selectAll("circle")
    .filter(function(d){
    	return d['IMDB Score'] > 7.5;
    })
    .style('fill', 'orange');
});

// **** Functions to call for scaled values ****

function scaleDate(date) {
    return dateScale(date);
}

function scaleIMDB(imdb) {
    return imdbScale(imdb);
}

// **** Code for creating scales, axes and labels ****

var dateScale = d3.scaleTime()
    .domain([new Date(2015, 0, 1), new Date(2022, 0, 1)]).range([60,700]);

var imdbScale = d3.scaleLinear()
    .domain([1,10]).range([340,20]);

var svg = d3.select('svg');

svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(dateScale).ticks(d3.timeYear));

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(360,390)')
    .text('Premiere Date');

svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(imdbScale));

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(15,200) rotate(90)')
    .text('IMDB Ranking');

svg.append('text')
    .attr('class', 'title')
    .attr('transform','translate(360,30)')
    .text('Netflix Originals Rankings');