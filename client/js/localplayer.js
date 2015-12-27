var util = require("./util.js"); //wow dank memes
var PIXI = require("./pixi.js");
var TextureManager = require('./texturemanager.js');
var Keyboard = require("./keyboard.js");

function LocalPlayer(x, y, game){
    var self = this;
    util._extend(this, new PIXI.Sprite(TextureManager.getTexture('kappa.png')));
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.position = { x: x, y: y }
    this.dir = 0; 
    this.destination = { x: self.position.x, y: self.position.y };
    this.velocity = 150;
    
    //this.width = 164;
    //this.height = 164;
    
    (this.constructor = function(){
       //maybe stuff goes in here dunno 
        
    })();
    
    this.update = function(dt){
        this.move(dt);

        if(game.keyboard.isKeyDown(game.keyboard.KEYS.shift)){
            this.velocity = 350;
        } else{
            this.velocity = 150;
        }
        
    }
    
    this.render = function(dt){
        /*
        game.graphics.clear();
        game.graphics.beginFill(0xe74c3c);
        game.graphics.drawCircle(self.position.x, self.position.y, 16);
        game.graphics.drawCircle(self.position.x, self.position.y, 16);
        game.graphics.endFill();
        */
        
    };
    
    this.shoot = function(){
        
    };
    
    this.move = function(dt) {
        var distance = {
            x: Math.abs(self.position.x - self.destination.x),
            y: Math.abs(self.position.y - self.destination.y)
        }; 
        //console.log("spam");

        if (distance.x + distance.y == 0)
            return; 
        
        var modX = distance.x / (distance.x + distance.y);
        var modY = distance.y / (distance.x + distance.y);
        var dirX = self.destination.x > self.position.x ? 1 : -1;
        var dirY = self.destination.y > self.position.y ? 1 : -1;
        var stepX = dirX * modX * self.velocity * dt;
        var stepY = dirY * modY * self.velocity * dt;
        
        if (Math.abs(stepX) > distance.x)
            self.position.x = self.destination.x;
            
        else
            self.position.x += stepX;
            
        if (Math.abs(stepY) > distance.y)
            self.position.y = self.destination.y;
            
        else
            self.position.y += stepY; 
        
    };

}

module.exports = LocalPlayer;