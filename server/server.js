var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('../client')); // probably needs to be done better later
app.use('/html', express.static('../../html'));
server.listen(8080, '0.0.0.0');

var users = {};

io.on('connection', function (socket) {
    
    if (!(socket.id in users)) {
        for (var id in users) {
            var user = users[id];
            socket.emit('new_kappa', { id: id, x: user.mousePos.x, y: user.mousePos.y });
        }
        
        users[socket.id] = {
            mousePos: { x: 0, y: 0 }
        };
   
        socket.broadcast.emit('new_kappa', { id: socket.id, x: 0, y: 0 });
    }
    
    socket.on('move_kappa', function(data) {
        if (!(socket.id in users))
            return;
        users[socket.id].mousePos = { x: data.x, y: data.y };
        socket.broadcast.emit('move_kappa', { id: socket.id, x: data.x, y: data.y });

    });
    
    socket.on('place_kappa', function(data) {
        socket.broadcast.emit('place_kappa', { id: socket.id, x: data.x, y: data.y });
    });
    
    socket.on('disconnect', function(){
        socket.broadcast.emit('remove_kappa', { id: socket.id });
        delete users[socket.id];
    });

});

