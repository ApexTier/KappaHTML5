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
    var distanceX = Math.abs(this.position.x - this.destination.x);
    var distanceY = Math.abs(this.position.y - this.destination.y);

    if (distanceX + distanceY == 0)
        return; 
    
    var modX = distanceX / (distanceX + distanceY);
    var modY = distanceY / (distanceX + distanceY);
    var dirX = this.destination.x > this.position.x ? 1 : -1;
    var dirY = this.destination.y > this.position.y ? 1 : -1;
    var stepX = dirX * modX * this.velocity * dt;
    var stepY = dirY * modY * this.velocity * dt;
    
    if (Math.abs(stepX) > distanceX)
        this.position.x = this.destination.x;
    else
        this.position.x += stepX;
        
    if (Math.abs(stepY) > distanceY)
        this.position.y = this.destination.y;
    else
        this.position.y += stepY;
    
};

module.exports = Entity;