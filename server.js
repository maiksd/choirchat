'use strict';

const PORT = 8081;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var user_count = 0;

// serve needed js files directly with no dependency on other mechanisms
var url_prefix = process.env.URL_PREFIX;
if(url_prefix) url_prefix = '';

app.get(url_prefix + '/socket.io/socket.io.js', function(req, res) {
	res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

app.get(url_prefix + '/jquery/jquery.js', function(req, res) {
	res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});

app.get(url_prefix + '/', function(req, res) {
	res.render('index.ejs');
});

// process socket communication
io.sockets.on('connection', function(socket) {

    // user submits her name on logon, store username and send welcome messages
	socket.on('username', function(username) {
		socket.username = username;
        if(!socket.username) socket.username='jemand';
		user_count += 1;
        io.emit('is_online', '<div>🟡 <i>' + socket.username + ' ist da</i></div>');
        socket.emit( 'chat_message', '<div>Willkommen in der Probe, ' + username + '! Hier kannst du mit den anderen Online-Teilnehmern chatten. Fragen an Joachim kann Maik per Stimme weiterreichen.</div>' );
        if( socket.username == 'jemand' ) {
            socket.emit( 'chat_message', '<div>Du kannst deinen Namen nachträglich noch setzen, indem du "/name MeinName" schreibst.</div>' );
        }
	});

    // user disconnects
	socket.on('disconnect', function(username) {
		if(socket.username ) {	 // prevent bogus messages if someone messes with the js debugger in her browser
			user_count -= 1;
			io.emit('is_online', '<div>🟣 <i>' + socket.username + ' ist wieder weg</i></div>');
		}
	})

    // user writes a message or command
	socket.on('chat_message', function(message) {
		if( message == '/count' ) {
			// use socket instead of io to return this only to the user who sent the command
            socket.emit( 'chat_message', '<div>Aktuell sind ' + user_count + ' Benutzer im Chat.</div>' );
        } else if( message.startsWith( '/name ' ) ) {
            var oldname = socket.username;
            socket.username = message.substring( message.indexOf(' ')+1 );
            io.emit('is_online', '<div>🟡 <i>' + oldname + '</i> heißt jetzt <i>' + socket.username + '</i></div>');
		} else {
			socket.emit('chat_message', '<div class="ich">' + message + '</div>');  // use io.emit if all should get it including sender
            socket.broadcast.emit('chat_message', '<div><strong>' + socket.username + '</strong>: ' + message + '</div>');
		}
	});

});

const server = http.listen(PORT, function() {
	console.log('listening on port ' + PORT);
});
