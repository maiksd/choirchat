'use strict';

const PORT = 8081;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const url_prefix = process.env.URL_PREFIX ? process.env.URL_PREFIX : '';

app.get(url_prefix+'/socket.io/socket.io.js', function(req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

app.get(url_prefix+'/jquery/jquery.js', function(req, res) {
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});

app.get(url_prefix+'/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {

    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' ist da</i>');
    });

    socket.on('disconnect', function(username) {
        if(socket.username)     // prevent bogus messages if someone messes with the js debugger in her browser
            io.emit('is_online', '🔴 <i>' + socket.username + ' ist wieder weg</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});
