// **** Your JavaScript code goes here ****


d3.csv('NetflixOriginals.csv').then(function(dataset) {
    console.log(dataset[0]);
    dataset.forEach(function(d) {
        var parser = d3.timeParse("%m/%d/%Y");
        d['Premiere'] = parser(d['Premiere']);
        d['IMDB Score'] = +d['IMDB Score'];
        console.log(typeof(d['IMDB Score'][0]))
    })


    const div=d3.select(".tooltip");
    console.log(div);
    var dots = d3.select("body").select("svg")
                .append('g')
                .attr('class', 'circle-g')
    d3.select(".circle-g")
    .selectAll(".circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d){
        return scaleDate(d['Premiere']);
    })
    .attr("cy", function(d){
          return scaleIMDB(d['IMDB Score']);
    })
    .attr("r", 3.5)
    .style("fill", function(d) {
        if (d['IMDB Score'] <= 4) {
            return '#177BD2'
        } else if (d['IMDB Score'] > 4 && d['IMDB Score'] <= 6) {
            return '#0E4AAC'
        } else {
            return '#093199'
        }
    ;})
    .style('opacity', 0.7)
    .on('mouseover', function(d){
        div.transition()
        .duration(200)
        .style("opacity",0.9);
        div.html(d.Title);
        div.style("left",(d3.event.pageX) +"px")
            .style("top",(d3.event.pageY-20) +"px")
    })
    .on("mouseout",function(d){
        div.transition()
        .duration(500)
        .style("opacity",0);
    });

    var svg = d3.select("#my_dataviz");
    svg.append("text").attr("x", 720).attr("y", 100).text("Legend:").style("font-size", "12px").attr("alignment-baseline","right")
    svg.append("circle").attr("cx",700).attr("cy",130).attr("r", 5).style("fill", "#177BD2")
    svg.append("circle").attr("cx",700).attr("cy",160).attr("r", 5).style("fill", "#0E4AAC")
    svg.append("circle").attr("cx",700).attr("cy",190).attr("r", 5).style("fill", "#093199")
    svg.append("text").attr("x", 720).attr("y", 130).text("IMDB Score < 4").style("font-size", "12px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 720).attr("y", 160).text("4 < IMDB Score < 6").style("font-size", "12px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 720).attr("y", 190).text("6 < IMDB Score").style("font-size", "12px").attr("alignment-baseline","middle")
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