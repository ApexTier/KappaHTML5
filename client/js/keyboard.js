function Keyboard() {
    var self = this;
    this.KEYS = {
        left: 37,
        right: 39,
        a: 65,
        d: 68,
        shift: 16
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


module.exports = Keyboard;