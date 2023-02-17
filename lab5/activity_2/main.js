var width = 500;
var height = 500;

d3.csv("cereals.csv", function (csv) {
  for (var i = 0; i < csv.length; ++i) {
    csv[i].Calories = Number(csv[i].Calories)
    csv[i].Fat = Number(csv[i].Fat);
    csv[i].Carb = Number(csv[i].Carb);
    csv[i].Fiber = Number(csv[i].Fiber);
    csv[i].Protein = Number(csv[i].Protein);
  }

//  console.log(csv);

  // Functions used for scaling axes +++++++++++++++
  var fatExtent = d3.extent(csv, function (row) {
      return row.Fat;
  });
  var carbExtent = d3.extent(csv, function (row) {
	  return row.Carb;
  });
  var fiberExtent = d3.extent(csv, function (row) {
    return row.Fiber;
  });
  var proteinExtent = d3.extent(csv, function (row) {
    return row.Protein;
  });

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  // Axis setup
  var xScale = d3.scaleLinear().domain(fatExtent).range([50, 470]);
  var yScale = d3.scaleLinear().domain(carbExtent).range([470, 30]);

  var xScale2 = d3.scaleLinear().domain(fiberExtent).range([50, 470]);
  var yScale2 = d3.scaleLinear().domain(proteinExtent).range([470, 30]);

  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);

  var xAxis2 = d3.axisBottom().scale(xScale2);
  var yAxis2 = d3.axisLeft().scale(yScale2);

  //Legend
  //Hint: Append circles to each selection to represent the calorie level
  d3.select("#LowCalorie").append("circle").attr("cx",6).attr("cy",6)
    .attr("r", 5).attr("stroke", "black").style("fill", "#ffe4e1").style('opacity', 0.6);
  d3.select("#MedCalorie").append("circle").attr("cx",6).attr("cy",6)
    .attr("r", 5).attr("stroke", "black").style("fill", "#F89880").style('opacity', 0.6);
  d3.select("#HighCalorie").append("circle").attr("cx",6).attr("cy",6)
    .attr("r", 5).attr("stroke", "black").style("fill", "#CD8161").style('opacity', 0.6);

  //Create SVGs for charts
  var chart1 = d3
    .select("#chart1")
    .append("svg:svg")
    .attr("id", "svg1")
    .attr("width", width)
    .attr("height", height);

  var chart2 = d3
    .select("#chart2")
    .append("svg:svg")
    .attr("id", "svg2")
    .attr("width", width)
    .attr("height", height);

  //Labels for Charts
  var title1 = d3
    .select("#svg1")
    .append("text")
    .attr("x", width/2)
    .attr("y", 12)
    .attr("font-size", "12px")
    .text("Fat vs Carb");

  var title2 = d3
    .select("#svg2")
    .append("text")
    .attr("x", width/2)
    .attr("y", 12)
    .attr("font-size", "12px")
    .text("Fiber vs Protein");

  //Labels for Axes
    var fatLabel = d3
    .select("#svg1")
    .append("text")
    .attr("x", width/2)
    .attr("y", height)
    .attr("font-size", "12px")
    .text("Fat");

    var carbLabel = d3
    .select("#svg1")
    .append("text")
    .attr("x", -width/2)
    .attr("y", 20)
    .attr("font-size", "12px")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("Carb");

    var fiberLabel = d3
    .select("#svg2")
    .append("text")
    .attr("x", width/2)
    .attr("y", height)
    .attr("font-size", "12px")
    .text("Fiber");

    var proteinLabel = d3
    .select("#svg2")
    .append("text")
    .attr("x", -width/2)
    .attr("y", 20)
    .attr("font-size", "12px")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("Protein");

  /******************************************
		
		Create Circles for Each Scatterplot

	 ******************************************/
    
  chart1 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(0," + (width - 30) + ")")
    .call(xAxis) // call the axis generator
    .append("text")
    .attr("class", "label")
    .attr("x", width - 16)
    .attr("y", -6)
    .style("text-anchor", "end");

  chart1 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(50, 0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");
  /****** Chart 1 *******/
  var scatterPlot1= chart1.selectAll("circle")
   .data(csv)
   .enter()
   .append("circle")
   .attr("id",function(d,i) {return i;} )
   .attr("stroke", "black")
   .attr("cx", function(d) { return xScale(d.Fat); })
   .attr("cy", function(d) { return yScale(d.Carb); })
   .attr("r", 5)
   .style("fill", function(d) {
        if (d.Calories <= 100) {
            return '#ffe4e1'
        } else if (d.Calories > 100 && d.Calories <= 130) {
            return '#F89880'
        } else {
            return '#CD8161'
        }
   ;})
   .style('opacity', 0.6)

  chart2 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(0," + (width - 30) + ")")
    .call(xAxis2)
    .append("text")
    .attr("class", "label")
    .attr("x", width - 16)
    .attr("y", -6)
    .style("text-anchor", "end");

  chart2 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(50, 0)")
    .call(yAxis2)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  /****** Chart 2 *******/

  var scatterPlot2= chart2.selectAll("circle")
   .data(csv)
   .enter()
   .append("circle")
   .attr("id",function(d,i) {return i;} )
   .attr("stroke", "black")
   .attr("cx", function(d) { return xScale2(d.Fiber); })
   .attr("cy", function(d) { return yScale2(d.Protein); })
   .attr("r", 5)
   .style("fill", function(d) {
      if (d.Calories <= 100) {
          return '#ffe4e1'
      } else if (d.Calories > 100 && d.Calories <= 130) {
          return '#F89880'
      } else {
          return '#CD8161'
      }
   ;})
   .style('opacity', 0.6)
   /******************************************

        Create Brushing and Blinking for Charts

   ******************************************/
    var brushContainer1 = chart1.append('g').attr('id', 'brushContainer1');
    var brushContainer2 = chart2.append('g').attr('id', 'brushContainer2');
    var brush1 = d3.brush().extent([[0, 0], [width, height]]);
    var brush2 = d3.brush().extent([[0, 0], [width, height]]);


    brush1.on('start', brushstart1)
    .on('brush', highlightBrushedCircles1)
    .on('end', displayValues1);

    brush2.on('start', brushstart2)
    .on('brush', highlightBrushedCircles2)
    .on('end', displayValues2);

    brushContainer1.call(brush1);
    brushContainer2.call(brush2);

    function brushstart1() {
        d3.select("#chart1").selectAll("circle").attr("class", "non_brushed");
        d3.select("#chart2").selectAll("circle").attr("class", "non_brushed");
        brush2.move(brushContainer2, null);
    }

     function highlightBrushedCircles1() {
        var selection = d3.event.selection;
        if (!selection) {
        return;
        }
        //un-brush circles
        var [[left, top], [right, bottom]] = selection;
        chart1.selectAll("circle").classed("hidden", function(d) {
            var cx = xScale(d.Fat);
            var cy = yScale(d.Carb);
            var selectedCircles = (left > cx || cx > right || top > cy || cy > bottom);
            console.log(selectedCircles);
            return selectedCircles;
        });



        brushed = chart1.selectAll("circle.hidden").data();
        chart2.selectAll("circle").classed("hidden", function(d) {
            return brushed.includes(d);
        });
     }

     function displayValues1() {
        var selection = d3.event.selection
        if (selection == null) {
         chart1.selectAll(".hidden").classed("hidden", false);
         chart2.selectAll(".hidden").classed("hidden", false);
        }
     }

      function brushstart2() {
        brush1.move(brushContainer1, null);
      }

       function highlightBrushedCircles2() {
            var selection = d3.event.selection;
            if (!selection) {
                return;
            }

            var [[left, top], [right, bottom]] = selection;
            chart2.selectAll("circle").classed("hidden", function(d) {
                var cx = xScale2(d.Fiber);
                var cy = yScale2(d.Protein);
                return left > cx || cx > right || top > cy || cy > bottom;
            });

            brushed = chart2.selectAll("circle.hidden").data();
            chart1.selectAll("circle").classed("hidden", function(d) {
                return brushed.includes(d);
            });
       }

       function displayValues2() {
            var selection = d3.event.selection;
            if (selection === null) {
                chart2.selectAll("circle.hidden").classed("hidden", false);
                chart1.selectAll("circle.hidden").classed("hidden", false);
            }
       }
});