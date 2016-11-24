var assert = require('assert');
var easysocket = require("../index");
var net = require('net');

describe("Client/Server", function(){

    var server;
    var client;
    var port = 7890;

    describe('#server:recv()', function() {
        it('should receive a greetings message from client', function(done) {
            server = net.createServer(function(socket) {
                 socket.once('data', function(data) {
                    easysocket.recieve(socket,data,function(socket,buffer){
                        assert.equal(buffer.toString(),"Hello server!");
                    });
                    client.end();
                    server.close();
                    done();
                });                
            });

            server.listen(port, function() {
                client = net.connect({port: port},function() {
                    easysocket.send(client, "Hello server!");
                });
            });
        });
    });

    describe('#client:recv()', function() {
        it('should receive a greetings message from server', function(done) {
            server = net.createServer(function(socket) {
                 easysocket.send(socket, "Hello client!");
            });

            server.listen(port, function() {
                client = net.connect({port: port},function() {
                    client.once('data', function(data) {
                        easysocket.recieve(client,data,function(socket,buffer){
                            assert.equal(buffer.toString(),"Hello client!");
                        });
                        done();
                    });
                });
            });
        });
    });
});