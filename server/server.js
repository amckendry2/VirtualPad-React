const express = require('express');
const cors = require ('cors');
const path = require('path');
// const mongoose = require('mongoose');
const server = require('http').createServer();
const WSClient = require('ws');
const WSServer = WSClient.Server;
const udpServer = require('dgram').createSocket('udp4');

const publicPath = path.join(__dirname, '..', 'build');
const port = process.env.PORT || 4000;

const app = express();
app.use(cors());

// mongoose.connect('');
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));

app.use(express.static(publicPath));

app.get('/', (_, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.post('/validation-request', (req, res) => {
    console.log('got validation request');
    // unityWS.send('put uri here');
    res.send('ws://127.0.0.1:4000');
});

app.post('/connection-request', (req, res) => {
    console.log('got connection request');
    //open udp connection here
    res.send('success');
})

server.on('request', app);

// const wsc = new WSClient('ws://127.0.0.1:5000');

// const wss = new WSServer({
//     server: server
// });

// wss.on('connection', ws => {
//     console.log('server-client websocket connection open');
//     ws.on('message', msg => {
//         console.log('received websocket message');
//         const buffer = new ArrayBuffer(6);
//         const view = new Uint8Array(buffer);
//         view[0] = 4; 
//         view[1] = 8; 
//         view[2] = 15; 
//         view[3] = 16; 
//         view[4] = 23;
//         view[5] = 42;
//         udpServer.send(view, 6970, 'localhost');
//     });
// });

server.listen(port, () => {
    console.log('Now listening on port: ' + port);
});
