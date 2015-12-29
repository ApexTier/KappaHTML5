//this fucking nightmare of a class 

var util = require("./util.js");
var PIXI = require("./pixi.js");
var Entity = require('./entity.js');

function Player(x, y, game) {
    
    var texture = 'kappa.png';
    
    Entity.call(this, texture); 
    
    this.game = game;
    this.graphics = new PIXI.Graphics();
    this.position.x = x;
    this.position.y = y;
    this.velocity = 50;
    
    this.bullets = [];
    this.health = 25;
    this.playerID = "";
    
    this.text = new PIXI.Text('ply - ' + this.playerID.substr(0,3) + " - " + this.health, {
        font : 'bold 24px Arial',
        fill : '#F7EDCA',
        stroke : '#38c467',
        strokeThickness : 2,
        wordWrap : true,
        wordWrapWidth : 440
    });
    this.game.stage.addChild(this.text);
    this.game.stage.addChild(this.graphics);
}

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function (dt) {
    this.text.x = this.position.x - (this.text.width / 2);
    this.text.y = this.position.y - (this.text.height) - 24;
    this.move(dt);
}

Player.prototype.render = function (dt) {
    /*
    this.graphics.clear();
    this.graphics.beginFill(0xe74c3c);
    this.graphics.drawCircle(this.position.x, this.position.y, 48);
    this.graphics.drawCircle(this.position.x, this.position.y, 48);
    this.graphics.endFill();
    */
}

Player.prototype.onCollision = function() {
    this.health -= 1;
    this.text.text = this.playerID.substr(0, 3) + " - " + this.health;
    if(this.health<=0){
            this.health=100;
            this.position.x=0;
            this.position.y=0;
        }
}

Player.prototype.destroy = function (dt) {
    //clean up
    this.game.stage.removeChild(this.graphics);

}

module.exports = Player;