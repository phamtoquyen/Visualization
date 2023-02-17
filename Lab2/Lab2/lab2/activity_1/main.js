// JavaScript code goes here

function pokemon(name,type,final_evolution,hp,attack_power) {
  this.name = name;
  this.type = type;
  this.final_evolution = final_evolution;
  this.hp = hp;
  this.attack_power = attack_power;
}

//Object
var pokemon1 = new pokemon("Bulbasaur", "Grass", "Venusaur", 80, 82);
var pokemon2 = new pokemon("Charmander", "Fire", "Charizard", 78, 84);
var pokemon3 = new pokemon("Squirtle", "Water", "Blastoise", 79, 83);

var pokemonList = [];
pokemonList.push(pokemon1);
pokemonList.push(pokemon2);
pokemonList.push(pokemon3);
console.log(pokemonList)