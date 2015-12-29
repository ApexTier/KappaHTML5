function Keyboard() {
    var self = this;
    this.KEYS = {
        left: 37,
        right: 39,
        a: 65,
        d: 68,
        shift: 16,
        space: 32
    };
    
    this.keysPressed = {};

    this.isKeyDown = function(keyCode) {
        return self.keysPressed[keyCode] != null;
    };

    this.onKeyDown = function (e) {
        if(self.keysPressed[e.which] == null)
            self.keysPressed[e.which] = true;
    };
    
    this.onKeyUp = function (e) {
        if(self.keysPressed[e.which] != null)
            delete self.keysPressed[e.which];
    };
};
//using a set was making nasty errors since i didnt know how to check if set contains if(!(val in set){} but it would error on keys not in it i believe
//so i changed this to a class/map

module.exports = Keyboard;