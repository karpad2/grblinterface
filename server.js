var config = require('./config');
var serialport = require("serialport");
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');
var static = require('node-static');
var EventEmitter = require('events').EventEmitter;
var url = require('url');
var qs = require('querystring');
var http = require('http');

// test for webcam
config.showWebCam = false;

http.get('http://127.0.0.1:8080', function(res) {

	console.log('enabling webcam');
	config.showWebCam = true;
}).on('socket', function(socket) {

	socket.setTimeout(2000);
	socket.on('timeout', function() {
		this.abort();
	});
}).on('error', function(e) {
	console.log('Got error: '+e.message+' not enabling webcam')
});

app.listen(config.webPort);
var fileServer = new static.Server('./fsserver');

function handler (req, res) {

	console.log(req.url);

	if (req.url.indexOf('/api/uploadGcode') == 0 && req.method == 'POST') {
		// this is a gcode upload, probably from jscut
		console.log('new data from jscut');
		var b = '';
		req.on('data', function (data) {
			b += data;
			if (b.length > 1e6) {
				req.connection.destroy();
			}
		});
		req.on('end', function() {
			var post = qs.parse(b);

			io.sockets.emit('gcodeFromJscut', {'val':post.val});
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringify({'data':'ok'}));
		});
	} else {
		fileServer.serve(req, res, function (err, result) {
			if (err) console.log('fileServer error: ',err);
		});
	}
}

function ConvChar( str ) {
  c = {'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#039;',
       '#':'&#035;' };
  return str.replace( /[<&>'"#]/g, function(s) { return c[s]; } );
}

var sp = [];
var allPorts = [];

serialport.list(function (err, ports) {
allPorts = ports;

	for (var i=0; i<ports.length; i++) {
	!function outer(i){

		sp[i] = {};
		sp[i].port = ports[i].comName;
		sp[i].q = [];
		sp[i].qCurrentMax = 0;
		sp[i].lastSerialWrite = [];
		sp[i].lastSerialReadLine = '';

		sp[i].handle = new serialport.parsers.Readline({delimiter: '\r\n'});
		// 1 means clear to send, 0 means waiting for response
		sp[i].port = new serialport(ports[i].comName, {
			baudRate: config.serialBaudRate
		});
		// write on the port
		sp[i].port.pipe(sp[i].handle);
		sp[i].sockets = [];

		sp[i].port.on("open", function() {

			console.log('connected at '+config.serialBaudRate, sp[i].port.path);

			// loop for status ?
			setInterval(function() {
				//console.log('writing ? to serial');
				sp[i].port.write('?');
			}, 1000);

		});

		// line from serial port
		sp[i].handle.on("data", function (data) {
			//console.log('got data', data);
			serialData(data, i);
		});

	}(i)
	}

});

function emitToPortSockets(port, evt, obj) {
	for (var i=0; i<sp[port].sockets.length; i++) {
		sp[port].sockets[i].emit(evt, obj);
	}
}

function serialData(data, port) {

	if (data.indexOf('<') == 0) {
		// https://github.com/grbl/grbl/wiki/Configuring-Grbl-v0.8#---current-status
    var t = data.substr(1);
    t = t.substr(0,t.length-2);
    t = t.split(/,|:/);
    emitToPortSockets(port, 'machineStatus', {'status':t[0], 'mpos':[t[2], t[3], t[4]]);
    return;
	}

	if (queuePause == 1) {

		return;
	}

	data = ConvChar(data);

	if (data.indexOf('ok') == 0) {

		// ok is green
		emitToPortSockets(port, 'serialRead', {'line':'<span class="console-ok">RESP: '+data+'</span>'});

		// run another line from the q
		if (sp[port].q.length > 0) sendFirstQ(port);


		// remove first
		sp[port].lastSerialWrite.shift();

	} else if (data.indexOf('error') == 0) {

		// error is red
		emitToPortSockets(port, 'serialRead', {'line':'<span class="console-err">RESP: '+data+'</span>'});

		// run another line from the q
		if (sp[port].q.length > 0) {
			// there are remaining lines in the q
			// write one
			sendFirstQ(port);
		}

		// remove first
		sp[port].lastSerialWrite.shift();

	} else {
		// other is grey
		emitToPortSockets(port, 'serialRead', {'line':'<span class="console-write">RESP: '+data+'</span>'});
	}

	if (sp[port].q.length == 0) sp[port].qCurrentMax = 0;



	// update q status
	emitToPortSockets(port, 'qStatus', {'currentLength':sp[port].q.length, 'currentMax':sp[port].qCurrentMax});

	sp[port].lastSerialReadLine = data;

}

var currentSocketPort = {};

function sendFirstQ(port) {

	if (sp[port].q.length < 1) {
		// nothing to send
		return;
	}
	var t = sp[port].q.shift();

	// remove any comments after the command
	tt = t.split(';');
	t = tt[0];
	// trim it because we create the \n
	t = t.trim();
	if (t == '' || t.indexOf(';') == 0) {
		// this is a comment or blank line, go to next
		sendFirstQ(port);
		return;
	}
	//console.log('sending '+t+' ### '+sp[port].q.length+' current q length');

	// loop through all registered port clients
	for (var i=0; i<sp[port].sockets.length; i++) {
		sp[port].sockets[i].emit('serialRead', {'line':'<span class="color-write">SEND: '+t+'</span>'+"\n"});
	}
	sp[port].port.write(t+"\n")
	sp[port].lastSerialWrite.push(t);
}

var queuePause = 0;
io.sockets.on('connection', function (socket) {

	socket.emit('ports', allPorts);
	socket.emit('config', config);

	// do soft reset, this has it's own clear and direct function call
	socket.on('doReset', function (data) {
		// soft reset for grbl, send ctrl-x ascii \030
		sp[currentSocketPort[socket.id]].port.write("\030");
		// reset vars
		sp[currentSocketPort[socket.id]].q = [];
		sp[currentSocketPort[socket.id]].qCurrentMax = 0;
		sp[currentSocketPort[socket.id]].lastSerialWrite = [];
		sp[currentSocketPort[socket.id]].lastSerialRealLine = '';
	});

	// lines from web ui
	socket.on('gcodeLine', function (data) {

		if (typeof currentSocketPort[socket.id] != 'undefined') {

			// valid serial port selected, safe to send
			// split newlines
			var nl = data.line.split("\n");
			// add to queue
			sp[currentSocketPort[socket.id]].q = sp[currentSocketPort[socket.id]].q.concat(nl);
			// add to qCurrentMax
			sp[currentSocketPort[socket.id]].qCurrentMax += nl.length;
			if (sp[currentSocketPort[socket.id]].q.length == nl.length) {
				// there was no previous q so write a line
				sendFirstQ(currentSocketPort[socket.id]);
			}

		} else {
			socket.emit('serverError', 'you must select a serial port');
		}

	});

	socket.on('clearQ', function(data) {
		// clear the command queue
		sp[currentSocketPort[socket.id]].q = [];
		// update the status
		emitToPortSockets(currentSocketPort[socket.id], 'qStatus', {'currentLength':0, 'currentMax':0});
	});

	socket.on('pause', function(data) {
		// pause queue
		if (data == 1) {
			console.log('pausing queue');
			queuePause = 1;
		} else {
			console.log('unpausing queue');
			queuePause = 0;
			sendFirstQ(currentSocketPort[socket.id]);
		}
	});

	socket.on('disconnect', function() {

		if (typeof currentSocketPort[socket.id] != 'undefined') {
			for (var c=0; c<sp[currentSocketPort[socket.id]].sockets.length; c++) {
				if (sp[currentSocketPort[socket.id]].sockets[c].id == socket.id) {
					// remove old
					sp[currentSocketPort[socket.id]].sockets.splice(c,1);
				}
			}
		}

	});

	socket.on('usePort', function (data) {

		console.log('user wants to use port '+data);
		console.log('switching from '+currentSocketPort[socket.id]);

		if (typeof currentSocketPort[socket.id] != 'undefined') {
			for (var c=0; c<sp[currentSocketPort[socket.id]].sockets.length; c++) {
				if (sp[currentSocketPort[socket.id]].sockets[c].id == socket.id) {
					// remove old
					sp[currentSocketPort[socket.id]].sockets.splice(c,1);
				}
			}
		}

		if (typeof sp[data] != 'undefined') {
			currentSocketPort[socket.id] = data;
			sp[data].sockets.push(socket);
		} else {
			socket.emit('serverError', 'that serial port does not exist');
		}

	});

});
