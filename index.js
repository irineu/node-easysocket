var easysocket = {
    _prepareSocket: function(socket){
        socket.chunck = {
            messageSize : 0,
            buffer: new Buffer(0),
            bufferStack: new Buffer(0)
        };
    },
    send: function(socket, data, callback) {

        if(!socket.chunck) easysocket._prepareSocket(socket);

        var buffer = new Buffer(data, "binary");
        var consolidatedBuffer = new Buffer(4 + buffer.length);

        consolidatedBuffer.writeInt32LE(buffer.length, 0);
        buffer.copy(consolidatedBuffer, 4);

        socket.write(consolidatedBuffer, function(err) {
            if (callback) {
                callback(socket);
            }
        });
    },
    recieve: function(socket, data,callback) {

        if(!socket.chunck) easysocket._prepareSocket(socket);

        socket.chunck.bufferStack = Buffer.concat([socket.chunck.bufferStack, data]);

        var reCheck = false;
        do {
            reCheck = false;
            if (socket.chunck.messageSize == 0 && socket.chunck.bufferStack.length >= 4) {
                socket.chunck.messageSize = socket.chunck.bufferStack.readInt32LE(0);
            }

            if (socket.chunck.messageSize != 0 && socket.chunck.bufferStack.length >= socket.chunck.messageSize + 4) {
                var buffer = socket.chunck.bufferStack.slice(4, socket.chunck.messageSize + 4);
                socket.chunck.messageSize = 0;
                socket.chunck.bufferStack = socket.chunck.bufferStack.slice(buffer.length + 4);
                callback(socket, buffer);
                reCheck = socket.chunck.bufferStack.length > 0;
            }
        } while (reCheck);
    }
}

module.exports = easysocket;
