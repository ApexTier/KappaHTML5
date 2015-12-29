//we cant overwrite it seems 
//var requestAnimationFrame = requestAnimationFrame || function() {}; //these fucking hax are killing me
//var PIXI = PIXI || null;
//var io = io || null;

var util = require("./util.js"); //wow dank memes
var Player = require("./player.js"); //used for other players
var LocalPlayer = require("./localplayer.js"); //used your own Kappa
var Keyboard = require("./keyboard.js");
var Bullet = require("./bullet.js");

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

function Game() {

    //private vars
    var self = this;
    var frameTime = 1.0 / 60.0; // 60 fps
    var lastFrameTime = 0;
    //public


    this.gameWidth = 800;
    this.gameHeight = 600;

    this.socket = io.connect('https://kappa-apextier.c9users.io:8080');
    this.net = new NetCode(this);

    this.keyboard = new Keyboard();

    this.kappas = {}; //rename later
    this.placedKappas = [];

    this.graphics = new PIXI.Graphics();

    this.entities = [];
    this.renderer;
    this.stage = new PIXI.Container();
    this.stage.interactive = true;
    this.stage.hitArea = new PIXI.Rectangle(0, 0, this.gameWidth, this.gameHeight);

    this.localKappa = new LocalPlayer(0, 0, this);
    
    //this.kappas.push(this.localKappa);

    PIXI.ticker.shared.add(function() {
        //tick?

    });

    this.update = function(dt) {
        self.localKappa.update(dt);
        
        var deadBullets = [];

        for (var i = 0; i < self.entities.length; i++) {
            if(self.entities[i].dead) { deadBullets.push(i); continue; }
            self.entities[i].update(dt);
        }

        //here?
        for (var id in self.kappas) {
            var kappa = self.kappas[id];
            self.kappas[id].update(dt);
            
            //check bullets
            for(var i=0; i<self.entities.length; i++) {
                var bullet = self.entities[i];
                
                if(bullet.dead) continue;
                //console.log("BulletTest pretest: "+bullet.playerID+" != \n"+kappa.playerID);
                if(bullet.playerID == kappa.playerID) continue;
               
                var collides = self.collidesCircle(kappa.position.x, kappa.position.y, 24, bullet.position.x, bullet.position.y, 5);
                if(collides){
                    self.entities.remove(i);  
                    self.stage.removeChild(bullet); //Remove sprite
                    kappa.onCollision();
                }
            }
        }
    

        if (self.localKappa.mouseDown)
            self.localKappa.shoot();
    };

    this.loop = function() {
        var elapsedTime = (Date.now() - lastFrameTime) / 1000;
        
        if (elapsedTime >= frameTime) {
            lastFrameTime = Date.now();
            self.update(elapsedTime); // logic
            
            self.localKappa.render(elapsedTime); // here

            for (var i = 0; i < self.entities.length; i++) {
                self.entities[i].render(elapsedTime);
            }

            for (var id in self.kappas) {
                self.kappas[id].render(elapsedTime);
            }
            
            self.graphics.clear();
            var cellSize = 100;
            for(var x=0; x <= self.gameWidth/cellSize; x++){
                self.graphics.drawRect((x*cellSize)-1, 0, 1, self.gameHeight);
                for(var y=0; y <= self.gameHeight/cellSize; y++){
                    self.graphics.beginFill(0x5dea7c);
                    self.graphics.drawRect(0, (y*cellSize)-1, self.gameWidth, 1);
                }
             
            }
           self.graphics.endFill();
           
           self.renderer.render(self.stage);
        }

        requestAnimationFrame(self.loop);

    };

    this.addEntity = function(ent) {
        this.entities.push(ent);
        this.stage.addChild(ent);
    };

    this.killKappa = function(kappa) {
        kappa.alpha -= 0.05;
        if (kappa.alpha <= 0) {
            this.stage.removeChild(kappa);
            this.placedKappas.splice(this.placedKappas.indexOf(kappa), 1);
        }
        else {
            setTimeout(function() {
                this.killKappa(kappa);
            }, 50);
        }
    }

    this.placeKappa = function(x, y) {
        var kappa = Player(0, 0, "assets/img/kappa.png", this);
        this.stage.addChildAt(kappa, 0);
        this.placedKappas.push(kappa);
        setInterval(function() {
            this.killKappa(kappa);
        }, 1000);
    }

    this.stage.on('mousedown', function() {
        self.localKappa.mouseDown = true;
    });

    this.stage.on('mouseup', function(e) {
        self.localKappa.mouseDown = false
    });

    this.stage.on('mousemove', function(e) {

        var mouseData = e.data.originalEvent;
        self.localKappa.destination.x = mouseData.offsetX;
        self.localKappa.destination.y = mouseData.offsetY;

    });
    
    this.collidesCircle = function(x1, y1, r1, x2, y2, r2) {
        var dx = x2-x1;
        var dy = y2-y1;
        var disSqr = r1+r2;
        return dx*dx+dy*dy <= disSqr*disSqr;
    }

    $(document).keydown(this.keyboard.onKeyDown);
    $(document).keyup(this.keyboard.onKeyUp);

    (this.constructor = function() {
        //ghetto constructor
        //var name = prompt("Choose a name");
        //self.socket.emit("user_name", {username: name});

        self.renderer = PIXI.autoDetectRenderer(self.gameWidth, self.gameHeight, {
            backgroundColor: 0x1099bb
        });
        $('body').append(self.renderer.view);

        self.stage.addChild(self.localKappa);
        self.stage.addChild(self.graphics);
        self.loop();
        //self.stage.scale = 0.5;

    })();

}

function NetCode(game) { //better then BF4

    game.socket.on('place_kappa', function(data) {
        game.placeKappa(data.x, data.y);
    });

    game.socket.on('new_kappa', function(data) {
        var kappa = new Player(data.x, data.y, game);
        kappa.playerID = data.id;
        kappa.text.text = data.id.substr(0, 3);
        
        console.log(game.socket.id + " joined the game");
        game.stage.addChild(kappa);
        game.kappas[data.id] = kappa;
    });

    game.socket.on('move_kappa', function(data) {
        if (!(data.id in game.kappas)) {
            var kappa = new Player(data.x, data.y, game);
            game.kappas[data.id] = kappa;
            game.stage.addChild(kappa);

        }
        else {
            var kappa = game.kappas[data.id];
            kappa.destination.x = data.x;
            kappa.destination.y = data.y;
            
        }
    });
    
    //here
    game.socket.on('on_bullet', function(data) {
        //idk where the prob is server or client
        var ply = game.kappas[data.id];
        if (ply == null)
            return;

        var bullet = new Bullet(data.x, data.y, data.x2, data.y2, game);

        bullet.tint = 0xff3232;
        bullet.playerID = data.id;
        game.addEntity(bullet);
        ply.bullets.push(bullet);
        console.log("NetBullet: " + bullet.playerID);
    
        if (ply.bullets.length > 200) {
            game.stage.removeChild(ply.bullets[0]);
            ply.bullets.shift();
        }

    });

    game.socket.on('remove_kappa', function(data) {
        if (data.id in game.kappas) {
            game.stage.removeChild(game.kappas[data.id]);
            game.kappas[data.id].destroy();
            delete game.kappas[data.id];
        }
    });

}

var g = new Game();