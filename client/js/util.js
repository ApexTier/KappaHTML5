var _copy = function(cls, baseClass) {
	for(var k in cls ) { baseClass[k] = cls[k]; }
}

module.exports =  {
    _extend: function(cls, baseClass) {
        _copy(baseClass, cls);
        cls.superClass = baseClass;
    }
}