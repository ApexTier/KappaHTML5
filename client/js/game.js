// editor shitz

//we cant overwrite it seems 
//var requestAnimationFrame = requestAnimationFrame || function() {}; //these fucking hax are killing me
//var PIXI = PIXI || null;
//var io = io || null;

var util = require("./util.js"); //wow dank memes
var Player = require("./player.js"); //used for other players
var LocalPlayer = require("./localplayer.js"); //used your own Kappa
var Keyboard = require("./keyboard.js");


function Game() {

    //private vars
    var self = this;
    var renderer;

    var gameWidth = window.innerWidth - 5;
    var gameHeight = window.innerHeight - 5;

    var frameTime = 1.0 / 60.0; // 60 fps
    var lastFrameTime = 0;

    var socket = io.connect('https://kappa-apextier.c9users.io:8080');
    var net = new NetCode(socket, this);
    
    this.keyboard = new Keyboard();

    //public vars
    this.localKappa = new LocalPlayer(0, 0, this);
    console.log(this.localKappa);
    this.kappas = {}; //rename later
    this.placedKappas = [];
    
    this.graphics = new PIXI.Graphics();

    this.entities = [];

    this.stage = new PIXI.Container();
    this.stage.interactive = true;


    PIXI.ticker.shared.add(function() {
        //tick?

    });

    this.update = function(dt) {
        self.localKappa.update(dt);
        
        for (var id in self.kappas) {
            self.kappas[id].move(dt);
        }
    };

    this.loop = function() {
        var elapsedTime = (Date.now() - lastFrameTime) / 1000;

        if (elapsedTime >= frameTime) {
            lastFrameTime = Date.now();
            self.update(elapsedTime); // logic
            renderer.render(self.stage);
            self.localKappa.render(elapsedTime);
        }

        requestAnimationFrame(self.loop);
        
        //console.log("spam")
  
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
        self.localKappa.shoot();
    });

    this.stage.on('mouseup', function(e) {
        //todo
    });

    this.stage.on('mousemove', function(e) {
        var mouseData = e.data.originalEvent;
        self.localKappa.destination.x = mouseData.offsetX;
        self.localKappa.destination.y = mouseData.offsetY;

        socket.emit('move_kappa', {
            x: self.localKappa.destination.x,
            y: self.localKappa.destination.y
        });
    });

    console.log(this.keyboard);
    $(document).keydown(this.keyboard.onKeyDown);
    $(document).keyup(this.keyboard.onKeyUp);

    (this.constructor = function() {
        //ghetto constructor
        renderer = PIXI.autoDetectRenderer(gameWidth, gameHeight, {
            backgroundColor: 0x1099bb
        });
        $('body').append(renderer.view);

        self.stage.addChild(self.localKappa);
        self.stage.addChild(self.graphics);
        self.loop();

    })();

}

function NetCode(socket, game) { //better then BF4
    
    socket.on('place_kappa', function(data) {
        game.placeKappa(data.x, data.y);
    });

    socket.on('new_kappa', function(data) {
        var kappa = new Player(data.x, data.y, game);
        game.stage.addChild(kappa);
        game.kappas[data.id] = kappa;
    });

    socket.on('move_kappa', function(data) {
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

    socket.on('remove_kappa', function(data) {
        if (data.id in game.kappas) {
            game.stage.removeChild(game.kappas[data.id]);
            delete game.kappas[data.id];
        }
    });
    
}

var g = new Game();