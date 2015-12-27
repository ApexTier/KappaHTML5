var util = require("./util.js");
var PIXI = require("./pixi.js");
var Entity = require('./entity.js');

function Player(x, y, game) {
    
    var texture = 'kappa.png';
    
    Entity.call(this, texture); 
    
    this.position.x = x;
    this.position.y = y;
    this.velocity = 150;
}

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function (dt) {
    this.move(dt);
}

module.exports = Player;