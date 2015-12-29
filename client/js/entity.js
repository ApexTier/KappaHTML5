var PIXI = require('./pixi.js');
var TextureManager = require('./texturemanager.js');

function Entity(texture) {
    PIXI.Sprite.call(this, TextureManager.getTexture(texture));
    
    this.velocity = 0;
    this.destination = { x: this.position.x, y: this.position.y };
    
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
}

Entity.prototype = Object.create(PIXI.Sprite.prototype);
Entity.prototype.constructor = Entity;

Entity.prototype.move = function (dt) {

    var distanceX = this.destination.x - this.position.x;
    var distanceY = this.destination.y - this.position.y;
    var sqrDist = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
    var lerp = 0.5; //0.5 is our lerp factor higher = faster lower = smoother
    
    //position is the same as destination dont move...
    if (distanceX + distanceY == 0)
        return;
    
    //normalized direction means to give a unit vector of length 1
    distanceX /= sqrDist;
    distanceY /= sqrDist;

    //now that we have normalized direction and sqr dist we can lerp based on time
    this.position.x += distanceX  * (sqrDist*lerp); 
    this.position.y += distanceY  * (sqrDist*lerp);
    
    
};

module.exports = Entity;