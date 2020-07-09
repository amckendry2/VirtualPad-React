const ENDPOINT = 'wss://wonderpad-server.herokuapp.com/:80';
const MOBILE_ENDPOINT = 'wss://192.168.1.2:4000';

const ws = new WebSocket(ENDPOINT);
ws.binaryType = 'arraybuffer';

ws.addEventListener('message',()=>{
    console.log("sending ID response");
    const buffer = new ArrayBuffer(2);
    const view = new Uint16Array(buffer);
    view[0] = 1; // 1 = client id
    ws.send(view);
});

export default ws;