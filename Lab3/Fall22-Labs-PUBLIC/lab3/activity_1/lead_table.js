// **** Your JavaScript code goes here ****
d3.csv('NetflixOriginals.csv').then(function(dataset) {
    console.log(dataset);

     var myArray = [];
        dataset.forEach(function(d, i){
        myArray.push([d["Title"],d["IMDB Score"], d["Premiere"].split('/')[2]]);
     });

     var rows = d3.select("body").select("tbody")
        .selectAll("tr")
     	.data(myArray)
     	.enter()
     	.append("tr");


     cells = rows.selectAll('td')
     .data(function(d) {
        return d;
     })
     .enter()
     .append('td')
     .text(function(d) {
        return d;
     });

    var p = d3.select("body").select("#netflix").selectAll("p")
    	.data(dataset)
    	.enter()
    	.append("p")
    	.text(function(d) {
    	return d['Title'] + ' premiered on date ' + d['Premiere'] + ',' +
    	' receiving an IMDB Score of: ' + d['IMDB Score'];
    	});

    var highest_score = d3.select("body").select("#netflix").select("p").style('color', 'ff0000');


});