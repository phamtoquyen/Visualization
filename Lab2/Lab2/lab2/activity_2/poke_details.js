// DOM #main div element
var main = document.getElementById('main');


// **** Your JavaScript code goes here ****
 pokemonList = [{
      "name": "Bulbasaur",
      "type": "Grass",
      "final_evolution": "Venusaur",
      "hp": 80,
      "attack_power": 82,
 },
 {
      "name": "Charmander",
      "type": "Fire",
      "final_evolution": "Charizard",
      "hp": 78,
      "attack_power": 84,
 },
 {
      "name": "Squirtle",
      "type": "Water",
      "final_evolution": "Blastoise",
      "hp": 79,
      "attack_power": 83,
 }]

// Implementation of the function

function halfHP(pokemon) {
    hp = pokemon.hp / 2;
	return hp;
}

let len = pokemonList.length;
for (i = 0; i < len; i++){
    if (JSON.stringify(pokemonList[i]) === JSON.stringify(pokemonList[0])){
        continue;
    }else {
        newHp = halfHP(pokemonList[i]);
        pokemonList[i].hp = newHp;
    }
}

function debugPoke(){
    for (i = 0; i < pokemonList.length; i++){
        console.log(pokemonList[i]);
    }
}


//DOM with Javascript

// document is the DOM, select the #main div
var main = document.getElementById("main");

// Create a new DOM element
var header = document.createElement("h3");
// Append the newly created <h3> element to #main
main.appendChild(header);
// Set the textContent to:
header.textContent = "Pokemon Starters";

function createDiv() {
    for (i = 0; i < pokemonList.length; i++){
        // Create a new <div> element
        var div1 = document.createElement("div");
        // Append the newly created <div> element to #main
        main.appendChild(div1);

        // Create a new <h5> element
        var name1 = document.createElement("h5");
        // Append the newly created <h5> element to your new div
        div1.appendChild(name1);
        // Set the textContent to the first pokemon's name
        name1.textContent = pokemonList[i]["name"];

        // type
        var type1= document.createElement("p");
        div1.appendChild(type1);
        type1.textContent = "Type: " +pokemonList[i]["type"];

        // final_evolution
        var type1= document.createElement("p");
        div1.appendChild(type1);
        type1.textContent = "final evolution: " +pokemonList[i]["final_evolution"];

        // hp
        var type1= document.createElement("p");
        div1.appendChild(type1);
        type1.textContent = "Health point: " +pokemonList[i]["hp"];

        // attack_power
        var type1= document.createElement("p");
        div1.appendChild(type1);
        type1.textContent = "Attack power: " +pokemonList[i]["attack_power"];
    }
}

createDiv();