// import * as binaryParsing from './binaryParsing';
import * as actionCreators from '../store/actions/connection';
import * as actionTypes from '../store/actions/actionTypes';

export const socketMiddleware = (() => {
    let socket = null;
    const onOpen = (store, gameCode) => () => {
        console.log('websocket open');
        const state = store.getState();
        const msgObj = {
            gameCode: gameCode,
            playerNum: state.connection.playerNum
        };
        const json = JSON.stringify(msgObj);
        socket.send(json);
        store.dispatch(actionCreators.wsConnected(gameCode));
    };
    const onClose = store => () => {
        store.dispatch(actionCreators.wsDisconnected());
    };

    const onError = store => error => {
        store.dispatch(actionCreators.wsError(error));
        store.dispatch(actionCreators.wsDisconnect());
    }
    return store => next => action => {
        switch(action.type) {
            case actionTypes.WS_CONNECT:
                if (socket !== null) {
                    socket.close();
                }
                socket = new WebSocket(action.host);
                socket.onopen = onOpen(store, action.gameCode);
                socket.onclose = onClose(store);    
                socket.onerror = onError(store);
                break;
            case actionTypes.WS_DISCONNECT:
                if (socket !== null) {
                    socket.close();
                }  
                socket = null;
                console.log('websocket closed');
                break;
            default:
                const result =  next(action);
                const nextState = {...store.getState()};
                const serverConnection = nextState.connection.serverConnection;
                if(action.sendInputState && serverConnection){
                    console.log("sending input data");
                    const buffer = new ArrayBuffer(12);
                    const view = new Uint16Array(buffer);
                    view[0] = nextState.connection.playerNum; 
                    view[1] = parseInt(nextState.input.stickDir);
                    view[2] = parseInt(nextState.input.stickMag);
                    view[3] = nextState.input.stickActive ? 1 : 0;
                    view[4] = nextState.input.aPressed ? 1 : 0;
                    view[5] = nextState.input.bPressed ? 1 : 0;
                    socket.send(view); 
                }
                return result;
        }
    };
})();