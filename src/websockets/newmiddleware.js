import WSServer from 'ws';
import http from 'http';

import * as binaryParsing from './binaryParsing';
import * as actionCreators from '../store/actions/connection';
import * as actionTypes from '../store/actions/actionTypes';

export const socketMiddleware = (() => {
    let wss = null;
    let server = null;
    let clientConnected = false;
    let unityWS = null;

    const onOpen = store => ws => {
        if (clientConnected) {
            ws.close();
        } else {
            clientConnected = true;
            console.log('websocket open');
            store.dispatch(actionCreators.wsConnected());
            ws.on('close', onClose(store));
            ws.on('error', onError(store));
            unityWS = ws;
        }
    };

    const onClose = store => () => {
        clientConnected = false;
        store.dispatch(actionCreators.wsDisconnected());
        unityWS = null;
    };

    const onError = store => error => {
        store.dispatch(actionCreators.wsDisconnect(error))
    }

    return store => next => action => {
        switch(action.type) {
            case actionTypes.WS_CONNECT:
                if (wss !== null) {
                    wss.close();
                }
                server = http.createServer();
                wss = new WSServer.Server({server: server});
                wss.on('connection', onOpen(store));   
                server.listen(process.env.PORT || 4000, () => {
                    console.log('Server is now listening');
                });
                break;
            case actionTypes.WS_DISCONNECT:
                if (wss !== null) {
                    wss.close();
                }  
                wss = null;
                console.log('websocket closed');
                break;
            default:
                const result =  next(action);
                const nextState = {...store.getState()};
                const unityConnection = nextState.connection.unityConnection;
                if(action.sendInputState && unityConnection){
                    console.log("sending input data");
                    const inputStateArrayBuffer = binaryParsing.inputStateToBinary(nextState);
                    unityWS.send(inputStateArrayBuffer); 
                }
                return result;
        }
    };
})();



/* export const socketInterface = store => next => action => {
    
    const result = next(action)
    const nextState = store.getState();
    const connectionState = {...nextState.connection};

    // if(action.sendInputState = true){
    //     const nextState = store.getState();
    //     const inputStateArrayBuffer = binaryParsing.inputStateToBinary(nextState);
    //     // console.log(new Date().getMilliseconds());
    //     ws.send(inputStateArrayBuffer);
    // }
    // }
    return result;
}; */