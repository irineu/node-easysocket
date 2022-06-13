# node-easysocket [![Build Status](https://travis-ci.org/irineu/node-easysocket.svg?branch=master)](https://travis-ci.org/irineu/node-easysocket)
No more headcache! This is a (very) simple snippet to save your time with socket communication!

#### Why node-easysocket?
It is simple! When you test a simple socket communication, in the more of times everything works fine, but when your project grouw up, after publish and test remote and bad connections, you will get some problems with truncated messages or messages with extra data (part of the next message). It is normal.
You will need create a protocol to handle that situation, maybe implement a header or a terminator (bad ideia), maybe you are already frustated with that notice.

#### node-easysocket solution:
It is a efficient plug-n-play solution for not change your code too much :P

##### Write operation:
Just replace the convencional write logic:
```
socket.write('Hello World!');
socket.write('{"message":"Hello World!"}');
 ```
 To the *easy write logic*:
```
easysocket.send(socket, 'Hello World!');
easysocket.send(socket, '{"message":"Hello World!}', function(socket) {
    console.log("Message with callback sent!");
});
```

##### Read operation:
Just replace the convencional read logic:
```
socket.on('data', function(data) {
    console.log("Recieved message: " + data);
});
 ```
 To the *easy read logic*:
```
//That method will be called when the procol read a message
function handleMessage(socket,buffer){
    console.log(buffer.toString(),"length:"+buffer.length);
    
    //Yes! No more problems with incomplete json!
    //var myObj = JSON.parse(buffer.toString());
    //You can also work with protobufs
    //var myProtoObj = proto.MyProtoByLargeBinaryData.decode(buffer);
}
socket.on('data', function(data) {
    console.log("bytes in:"+data.length);
    easysocket.recieve(socket,data,handleMessage);
});
```

##### NOTE: 

1. If a chunk contains 5 messages, the method **handleMessage** will be called 5 times with the respective message.
2. If a chunk contains 2 messages and a half, it will be called 2 times, and when the end of the message comes on next chunk, the method will be called.
3. And YES! If the first message is too much large (but no more than **~2.1GB\*\***) and be splitted in many chunks, the **handleMessage** will be called only full message reach ;)
 
##### Limitations:
The embedded protocol use a header with 4 bytes to indicate the size of your message, so you can only send a message with: **2147483647 bytes (~2.1GB)**. If you need more than it, just fork this project on github and expand to fit your needs.

#### Improvements:
This is a nice snippet for simple communications purposes. If you need a more robust communcation solution, please check: https://github.com/irineu/eight-protocol
