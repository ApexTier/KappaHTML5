var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('../client')); // probably needs to be done better later
app.use('/html', express.static('../../html'));
server.listen(8080, '0.0.0.0');

var users = {};

var entities = [];

io.on('connection', function (socket) {
    
    if (!(socket.id in users)) {
        //tell the socket about current players
        for (var id in users) {
            var user = users[id];
            socket.emit('new_kappa', { id: id, x: user.mousePos.x, y: user.mousePos.y });
        }
        
        users[socket.id] = {
            mousePos: { x: 0, y: 0 }
        };
        
        socket.emit('init', {
            id: socket.id
        })
   
        //tell everyone but the socket a new player joined
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
    
    socket.on('fire_bullet', function(data){
         //this is the server recieving the firebullet
         var obj = {
             id: socket.id,
             x: data.x, 
             y: data.y,
             x2: data.x2,
             y2: data.y2
         }

         socket.broadcast.emit("on_bullet", obj);
    });
    
    socket.on('disconnect', function(){
        socket.broadcast.emit('remove_kappa', { id: socket.id });
        delete users[socket.id];
    });

});

