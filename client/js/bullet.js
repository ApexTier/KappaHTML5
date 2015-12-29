var util = require("./util.js");
var PIXI = require("./pixi.js");
var TextureManager = require('./texturemanager.js');

function Bullet(x, y, x2, y2, game){
    var self = this;
    util._extend(this, new PIXI.Sprite(TextureManager.getTexture('bullet.png')));
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.position = { x: x, y: y }
    this.velocity = 600;
    this.playerID = null;
    this.dead = false;
    this.friendly = false;

    this.rotation = Math.atan2(y2 - y, x2 - x);

    this.update = function(dt){
        if(self.dead){
            console.log("DEAD BULLET?");
            return;
        }
        
   		var vx = this.velocity * Math.cos(this.rotation);
		var vy = this.velocity * Math.sin(this.rotation);
		
		this.position.x += vx * dt;
		this.position.y += vy * dt;
    }
    
    this.render = function(dt){
      
        
    } 

}

module.exports = Bullet;