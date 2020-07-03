'use strict';

const PORT = 8081;
const admin_secret = '8hAKgUpqdCFAjPpzsbsvt3';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var viewer_count = 0;
var chatuser_count = 0;
var log_named_users = true;

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

function do_log_connects( username ) {
	if( !log_named_users ) return false;
	return( !username.startsWith( 'jemand' ) );
}

// process socket communication
io.sockets.on('connection', function(socket) {

	viewer_count += 1;
	socket.username = 'jemand' + viewer_count;
	socket.is_admin = false;

	socket.emit( 'chat_message', '<div>Willkommen in der Probe!'
	//	+ ' <b>Damit du etwas hörst, musst du den Ton des Videostreams unten einschalten.</b>'
		+ ' Hier kannst du mit den anderen Online-Teilnehmern chatten.'
		+ ' Bitte gib oben deinen Namen an.<br/>'
		+ ' Fragen an Joachim bitte als solche formulieren, die können vom Moderator per Stimme weiter gereicht werden.'
		+ '</div>' );

	// user submits her name on logon, store username and send welcome messages
	socket.on('username', function(username) {
		socket.username = username;
		chatuser_count += 1;
		if( do_log_connects(socket.username) ) {
			io.emit('chat_message', '<div>🟡 <i>' + socket.username + ' ist da</i></div>');
		}
		if( socket.username == 'jemand' ) {
			socket.emit( 'chat_message', '<div>Du kannst deinen Namen nachträglich noch setzen, indem du "/name MeinName" schreibst.</div>' );
		}
	});

	// user disconnects
	socket.on('disconnect', function(username) {
		if(socket.username ) {	 // prevent bogus messages if someone messes with the js debugger in her browser
			viewer_count -= 1;
			if( viewer_count < 0 ) viewer_count = 0;
			chatuser_count -= 1;
			if( chatuser_count < 0 ) chatuser_count = 0;
			if( do_log_connects(socket.username) ) {
				io.emit('chat_message', '<div>🟣 <i>' + socket.username + ' ist wieder weg</i></div>');
			}
		}
	})

	// user writes a message or command
	// TODO this has grown, refactor
	socket.on('chat_message', function(message) {
		if( message.startsWith('/admin' ) ) {
			var arg = message.substring( message.indexOf(' ')+1 );
			if( arg == admin_secret ) {
				socket.is_admin = true;
			}
		} else if( message == '/count' ) {
			var msg;
			if( viewer_count > 1 ) {
				msg = '<div>Aktuell sind ' + viewer_count + ' Sänger(innen) online, '
					+ (viewer_count > chatuser_count ? 'davon ' + chatuser_count : 'alle')
					+ ' auch im Chat.</div>';
			} else {
				msg = '<div>Du bist im Moment noch alleine hier.</div>';
			}
			// use socket instead of io to return this only to the user who sent the command
			socket.emit( 'chat_message', msg );
		} else if( message == '/resetcount' ) {
			if( socket.is_admin ) {
				viewer_count = 1;
				chatuser_count = 1;
			}
		} else if( socket.is_admin && message.startsWith('/logconnects') ) {
			var onoff = message.substring( message.indexOf(' ')+1 );
			if( onoff == 'on' ) {
				log_named_users = true;
			} else if( onoff == 'off' ) {
				log_named_users = false;
			}
		} else if( message.startsWith( '/name ' ) ) {
			var oldname = socket.username;
			socket.username = message.substring( message.indexOf(' ')+1 );
			io.emit('chat_message', '<div>🟡 <i>' + oldname + '</i> heißt jetzt <i>' + socket.username + '</i></div>');
		} else if( message == '/help' ) {
			socket.emit('chat_message', '<div>/name NeuerName</div>');
			socket.emit('chat_message', '<div>/count</div>');
			if( socket.is_admin ) {
				socket.emit('chat_message', '<div>/resetcount</div>');
				socket.emit('chat_message', '<div>/logconnects on|off</div>');
			}
		} else {
			socket.emit('chat_message', '<div class="ich">' + message + '</div>');  // use io.emit if all should get it including sender
			socket.broadcast.emit('chat_message', '<div><strong>' + socket.username + '</strong>: ' + message + '</div>');
		}
	});

});

const server = http.listen(PORT, function() {
	console.log('listening on port ' + PORT);
});
