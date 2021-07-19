import gameData from './gameData.js';
import commTypes, {constructMessage} from './commTypes.js';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
const server = http.createServer();
import ws from 'ws';
const WSServer = ws.Server;

const publicPath = path.join('.', '..', 'build');
const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(publicPath));

const GAME_CODE_LENGTH = 4;

/////////////
//HTTP
/////////////

app.get('/', (_, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.post('/connection-request', (req, res) => {
    console.log('got validation request');
    const { gameCode } = req.body;
    let response = {
        type: 'error',
        error: 'Game not found'
    }
    if(gameData.containsGame(gameCode)){
        const game = gameData.getGame(gameCode);
        if(game.hasRoom()){
            const playerNum = game.getNextPlayer();
            console.log('playernum = ' + playerNum);
            game.addPlayer(playerNum);
            const currentPlayers = game.getCurrentPlayers();
            console.log('currentplayers = ' + currentPlayers);
            const url = 'ws://10.84.1.128:' + port;
            response = {
                type: 'success',
                url: url,
                playerNum: playerNum,
            }
            const msgObj = {playerNum: playerNum, currentPlayers: currentPlayers};
            const msg = constructMessage(msgObj, commTypes.PLAYER_JOINED);
            game.send(msg);
        } else {
            response = {
                type: 'error',
                error: 'Game is full'
            };
        }
    }
    res.send(response);
});

server.on('request', app);

/////////////
//WEBSOCKETS
/////////////

const wss = new WSServer({
    server: server
});

wss.on('connection', (ws, _) => {
    console.log('server-client websocket connection open');
    ws.addEventListener('message', msg => {
        const data = JSON.parse(msg.data);
        if(gameData.containsGame(data.gameCode)){
            ws.game = data.gameCode;
            ws.playerNum = data.playerNum;
        } else {
            ws.close();
        }
        ws.binaryType='arraybuffer';
        ws.on('message', msg => {
            if(gameData.containsGame(ws.game)){
                gameData.saveInput(msg, ws.game);
            } else {
                console.log("Got input for nonexistant game");
                ws.close();
            }
        });
        ws.on('close', ()=>{
            if(gameData.containsGame(ws.game)){
                const game = gameData.getGame(ws.game);
                game.removePlayer(ws.playerNum);
                const currentPlayers = game.getCurrentPlayers();
                const msgObj = {
                    playerNum: ws.playerNum,
                    currentPlayers: currentPlayers                    
                }
                const playerLeftMessage = constructMessage(msgObj, commTypes.PLAYER_LEFT);
                game.send(playerLeftMessage);
            }
        });
    },{once: true})
});

/////////////
//UDP
/////////////

import dgram from 'dgram'
const udps = dgram.createSocket('udp4');

udps.on('error', err => {
    console.log(err);
});

udps.on('message', (msg, rinfo) => handleData(msg, rinfo));

const handleData = (msg, rinfo) => {
    const data = bytesToObj(msg);
    switch (data.type){
        case 'register':     
            console.log('got registration request');
            console.log('#players: ' + data.players)
            const game = gameData.addGame(GAME_CODE_LENGTH, data.players, rinfo, udps);
            game.send(constructMessage({gameCode: game.getCode()}, commTypes.CONNECTION_SUCCESSFUL));
            break;
        case 'ping':
            if(gameData.containsGame(data.gameCode)){
                gameData.pingGame(data.gameCode);
            }
            break;
        default: break;
    }
}

const bytesToObj = bytes => JSON.parse(bytes.toString());

udps.bind(6000);

server.listen(port, '0.0.0.0', () => {
    console.log('Now listening on port: ' + port);
});
