// Variables
var main = d3.select('#main');

// Select all the pokemon type tabs
d3.selectAll('.poke-tab')
    .on('click', function(){
        // On click, activate the selected tab (this), and de-select the previously active tab
        var clickedTab = d3.select(this);

        d3.select('.poke-tab.active').classed('active',false);
        clickedTab.classed('active',true);

        // Get which pokemon type was selected, call updateBars
        var type = clickedTab.attr('data-type');
        updateBars(type);
    });

// Show bars for fire types on page load
d3.select(window).on('load', function(){
    updateBars('Fire');
});

function renderBars(data) {
    // Create a selection for pokemon hp bars
    var select = d3.selectAll('.poke-hp')
        .data(data);

    // Append divs for each character, class them to reference later
    var enter = select.enter().append('div')
        .attr('class','poke-hp');

    // Append a <p> element to the newly appended div.poke-hp
    var pEnter = enter.append('p')
        .attr('class', 'poke-name');

    // Append <div><div></div></div> to create the progress-bar structure
    var fillEnter = enter.append('div')
        .attr('class', 'poke-progress-bar')
        .append('div')
        .attr('class', 'poke-progress-bar-fill');

    // Append a <p> element to display the hp value
    var valEnter = fillEnter.append('p')
        .attr('class', 'poke-progress-bar-value');

    // Now this is where we update both the newly created elements on screen and the ones already present

    // Merge the .poke-name elements on screen elements with the newly created ones, and update name
    select.select('.poke-name').merge(pEnter)
        .text(function(d){
            return d['name'];
        });

    // Merge the .poke-progress-bar-fill on screen elements with the newly created ones, and update width
    select.select('.poke-progress-bar-fill').merge(fillEnter)
        .style('width', function(d){
            return 'calc(' + d['hp'] + '% - 3px)';
        });

    // Merge the .poke-progress-bar-value on screen elements with the newly created ones, and update text,
    // positioning, and color
    select.select('.poke-progress-bar-value').merge(valEnter)
        .text(function(d){
            return d['hp'] + '%';
        })
        .style('padding-left',function(d){
            return d['hp'] > 5 ? 0 : '30px';
        })
        .style('color',function(d){
            return d['hp'] > 5 ? '#222' : '#fff';
        });

    // Remove all elements that no longer have data bound to them
    select.exit().remove();
}

// **** Your JavaScript code goes here ****

function updateBars(type) {
    // Edit this function to filter the characters based on affiliation
    // You will need a special case for the top characters 'top'
    let filteredType = pokemonList.filter((object) => object.type === type);
    filteredType.sort( function(a, b){
    	return a.hp - b.hp;
    });
    renderBars(filteredType);
}