import * as binaryParsing from './binaryParsing';
import * as actionCreators from '../store/actions/connection';
import * as actionTypes from '../store/actions/actionTypes';

export const socketMiddleware = (() => {
    let socket = null;
    const onOpen = store => () => {
        console.log('websocket open');
        store.dispatch(actionCreators.wsConnected());
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
                socket.onopen = onOpen(store);
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
                const unityConnection = nextState.connection.unityConnection;
                if(action.sendInputState && unityConnection && serverConnection){
                    console.log("sending input data");
                    const inputStateArrayBuffer = binaryParsing.inputStateToBinary(nextState);
                    socket.send(inputStateArrayBuffer); 
                }
                return result;
        }
    };
})();