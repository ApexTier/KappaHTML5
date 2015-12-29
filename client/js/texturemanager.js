var PIXI = require("./pixi.js");
var TextureManager = {
    texturesPath: './assets/img/', //so this worked
    textures: {}, 
    loadTexture: function (filename) {
        this.textures[filename] = new PIXI.Texture.fromImage(this.texturesPath + filename);
    },
    getTexture: function (filename) { 
        if (!(filename in this.textures)) {
            this.loadTexture(filename);
        }
        return this.textures[filename];
    }
};

module.exports = TextureManager;