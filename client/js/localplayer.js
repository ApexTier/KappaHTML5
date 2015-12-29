var util = require("./util.js"); //wow dank memes
var PIXI = require("./pixi.js");
var TextureManager = require('./texturemanager.js');
var Bullet = require('./bullet.js');

function LocalPlayer(x, y, game){
    var self = this;
    util._extend(this, new PIXI.Sprite(TextureManager.getTexture('kappa.png')));
    
    this.game = game;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.position = { x: x, y: y }
    this.dir = 0; 
    this.destination = { x: self.position.x, y: self.position.y };
    this.velocity = 25;
    this.playerID = "";
    
    this.health = 50;
    
    this.lastFire = 0;
    this.fireDelay = 0.015;
    
    this.bullets = [];
    
    this.text = new PIXI.Text('Me - ' + this.playerID.substr(3), {
        font : 'bold 24px Arial',
        fill : '#F7EDCA',
        stroke : '#38c467',
        strokeThickness : 2,
        wordWrap : true,
        wordWrapWidth : 440
    });
    this.graphics = new PIXI.Graphics();
    
    this.mouseDown = false;
    
    (this.constructor = function(){
        game.stage.addChild(self.text);
        game.stage.addChild(self.graphics);
        
        game.socket.on("init", function(data){
            game.kappas[data.id] = self;
            self.playerID = data.id;
            self.text.text = data.id.substr(0, 3) + " - " + self.health;
        });
        
    })();
    
    this.onCollision = function() {
        this.health -= 1;
        this.text.text = this.playerID.substr(0, 3) + " - " + this.health;
        if(this.health<=0){
            self.health=100;
            self.position.x=0;
            self.position.y=0;
        }
    }
    
    this.update = function(dt){
        if(dt >= 1)
            return;
        
        this.move(dt);

        this.text.x = self.position.x - (this.text.width / 2);
        this.text.y = self.position.y - (this.text.height) - 24;
        
        game.keyboard.isKeyDown(game.keyboard.KEYS.shift) ? this.velocity = 100 : this.velocity = 50;

        game.socket.emit('move_kappa', {
            x: self.position.x,
            y: self.position.y
        });
    }
    
    this.render = function(dt){
        self.graphics.clear();
        self.graphics.beginFill(0x5dea7c);
        self.graphics.drawCircle(self.destination.x, self.destination.y, 8);
        self.graphics.drawCircle(self.position.x, self.position.y, 32);
        self.graphics.endFill();
        
    };
    
    this.shoot = function(){
        var time = new Date()/1000;
        if(time - this.lastFire < this.fireDelay)
            return;

        var mouse = game.renderer.plugins.interaction.mouse.global;        
        var bullet = new Bullet(this.position.x, this.position.y, mouse.x, mouse.y, game);
        bullet.playerID = self.playerID;
        game.addEntity(bullet);
        bullet.friendly = true;
        
        console.log("LocalBullet: " + self.playerID);
        this.bullets.push(bullet)
        this.lastFire = new Date()/1000;

        game.socket.emit("fire_bullet", {
            x: self.position.x,
            y: self.position.y,
            x2: mouse.x,
            y2: mouse.y
        });
        
        if(this.bullets.length > 200){
            game.stage.removeChild(this.bullets[0]);
            this.bullets.shift(); //seems to just set it no need to overwrite i supposegame.
        }
        
        
    };
    
    this.move = function(dt) {
            
        if(game.keyboard.isKeyDown(game.keyboard.KEYS.space))
            return;    
            
        var distanceX = this.destination.x - this.position.x;
        var distanceY = this.destination.y - this.position.y;
        var sqrDist = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
        
     
        //position is the same as destination dont move...
        if (distanceX + distanceY == 0)
            return;
        
        //normalized direction means to give a unit vector of length 1
        distanceX /= sqrDist;
        distanceY /= sqrDist;
        var slowSpeed = 25;
        //now that we have normalized direction and sqr dist we can lerp based on time
        this.position.x += distanceX * this.velocity * dt * Math.min(1, (sqrDist/slowSpeed)); 
        this.position.y += distanceY * this.velocity * dt * Math.min(1, (sqrDist/slowSpeed));
        
        //screen clamping
        this.position.x = Math.max(0,Math.min(game.gameWidth,this.position.x));
        this.position.y = Math.max(0,Math.min(game.gameHeight,this.position.y));
    };

}

module.exports = LocalPlayer;