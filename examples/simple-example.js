var easysocket = require("../index");
var net = require('net');
var port = 8124;

function handleMessage(socket,buffer){
    console.log(">",buffer.toString(),buffer.length + " bytes");
}

var server = net.createServer(function(socket) {

    console.log('SERVER','client connected');

    socket.on('end', function() {
        console.log("SERVER","client disconnected, exiting...");
        process.exit();
    });

    socket.on('data', function(data) {
        console.log('SERVER',"bytes in:"+data.length);
        easysocket.recieve(socket,data,handleMessage);
    });

    easysocket.send(socket, "Hello World from server!");
    easysocket.send(socket, "Hello World from server with callback", function() {
        console.log('SERVER',"Message with callback sent!");
    });
});
server.listen(port, function() {
    console.log('SERVER','server bound, now after 5secs we will send a message for the server...');

    setTimeout(function() {
        var client = net.connect({port: port},function() {
            console.log('CLIENT','connected to server!');
        });

        client.on("data", function(data){
            console.log('CLIENT',"bytes in:"+data.length);
        	easysocket.recieve(client,data,handleMessage);
        	easysocket.send(client, "Greetings from client!",function(clientSocket){
                clientSocket.end();
            });
        });
    }, 5000);
});
