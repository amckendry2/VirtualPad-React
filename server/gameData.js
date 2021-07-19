import commTypes, {constructMessage} from './commTypes.js';

const gameData = (() => {
    
    const games = {};
    
    return {

        containsGame: function (gameCode){
            return games.hasOwnProperty(gameCode);
        },

        getGame: function (gameCode){
            if(games.hasOwnProperty(gameCode)){
                return games[gameCode];
            }
        },

        getNewGameCode: function(len){
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let output;
            do {
                output = '';
                for (let i=0; i<len; i++){
                    output += chars.charAt(Math.floor(Math.random() * chars.length));
                }
            } while (this.containsGame(output));
            return output;
        },

        addGame: function (codeLen, players, rinfo, udps){
            const gameCode = this.getNewGameCode(codeLen);
            const udpFunc = msg => udps.send(msg, rinfo.port, rinfo.address);
            const disconnectMsg = constructMessage({gameCode: gameCode}, commTypes.CONNECTION_CLOSED);
            const noPingUdpFunc = () => udps.send(disconnectMsg, rinfo.port, rinfo.address);
            const pingMsg = constructMessage({gameCode: gameCode}, commTypes.PING);
            const pingFunc = () => udps.send(pingMsg, rinfo.port, rinfo.address);
            const inputDataUdpFunc = playerInputs => {
                for (let i=0; i < playerInputs.length; i++){
                    if(playerInputs[i]){
                        const inputBuf = Buffer.from(playerInputs[i]);
                        const inputMsg = Buffer.concat([commTypes.INPUT_DATA, inputBuf]);
                        udps.send(inputMsg, rinfo.port, rinfo.address);
                    }
                }
            }
            const removeFunc = () => this.removeGame(gameCode);
            const game = gameFactory(gameCode, players, rinfo, udpFunc, noPingUdpFunc, inputDataUdpFunc, removeFunc, pingFunc);
            games[gameCode] = game;
            return game;
        },

        removeGame: function(gameCode){
            if(this.containsGame(gameCode)) {
                this.getGame(gameCode).clearIntervals();
                delete games[gameCode];
            }
        },

        pingGame: function (gameCode){
            if(this.containsGame(gameCode)){
                // console.log('got ping for ' + gameCode);
                const game = this.getGame(gameCode);
                game.ping();
                return;
            }
        },

        hasRoom: function(gameCode){
            return games[gameCode].hasRoom();
        },

        saveInput: function(input, gameCode){
            games[gameCode].saveInput(input);
        }, 
        
        send: function(msg, gameCode){
            if(this.containsGame(gameCode)){
                games[gameCode].send(msg);
            }
        },

        logGames: setInterval(()=>{
            console.log("Active games: " + Object.keys(games));
        }, 5000)

    }
})();

const gameFactory = (_gameCode, players, _rinfo, udpFunc, noPingUdpFunc, inputDataUdpFunc, removeFunc, pingFunc) => {
    const gameCode = _gameCode;
    const rinfo = {..._rinfo};
    let pinged = false;
    const maxPlayers = players;
    let currentPlayers = 0;
    const playerInputs = new Array(players);
    const playerArray = [maxPlayers];
    for(let i = 0; i < maxPlayers; i++){
        playerArray[i] = playerFactory();
    }
    const checkPingInterval = setInterval(() => {
        if(!pinged){
            // console.log('closing ' + gameCode + ' due to inactivity');
            noPingUdpFunc();
            removeFunc();
        } else {
            pinged = false;
            // console.log('game ' + gameCode + ' still active');
        }
    }, 10000);
    const sendInterval = setInterval(() => {
        inputDataUdpFunc(playerInputs);
    }, 16.666);
    const pingInterval = setInterval(() => {
        // console.log("sending ping");
        pingFunc();
    }, 1000);

    return {

        getCode: () => gameCode,

        getRinfo: () => rinfo,

        hasRoom: () => currentPlayers < maxPlayers,

        getCurrentPlayers: () => currentPlayers,

        addPlayer: (playerNum) => {
            playerArray[playerNum].joined();
            currentPlayers = currentPlayers < maxPlayers ? currentPlayers + 1 : maxPlayers;
        },

        removePlayer: (playerNum) => {
            playerArray[playerNum].left();
            currentPlayers = currentPlayers > 0 ? currentPlayers - 1 : 0;
        },

        getNextPlayer: () => {
            let nextPlayer = null;
            for (let i = playerArray.length - 1; i >= 0; i--){
                if(!playerArray[i].isActive()) nextPlayer = i
            }
            return nextPlayer;
        },

        saveInput: input => {
            const view = new Uint16Array(input);
            playerInputs[view[0]] = input;
        },

        clearIntervals: () => {
            clearInterval(checkPingInterval);
            clearInterval(sendInterval);
            clearInterval(pingInterval);
        },

        ping: () => pinged = true,

        send: msg => udpFunc(msg),
    }
}

const playerFactory = ()=>{
    let active = false;
    return {
        joined: () => active = true,
        left: () => active = false,
        isActive: () => active
    }
};

export default gameData;