import ws from '../webSocketClient';
import * as actionTypes from './actions/actionTypes';

export const socketSend = store => next => action => {
    let result = next(action)
    // const teststr = '98eb7b0a-d58c-4bc5-8d73-401887744e09'
    
    // console.log(teststr.length);
    if(action.type === actionTypes.ENTER_ID){
        const buffer = new ArrayBuffer(2)
        const view = new Uint16Array(buffer);
        view[0] = 1212 // test id
        ws.send(view);
    } else {
        const nextState = store.getState();
        const buffer = new ArrayBuffer(12);
        const view = new Uint16Array(buffer);
        view[0] = 1; 
        view[1] = parseInt(nextState.stickDir);
        view[2] = parseInt(nextState.stickMag);
        view[3] = nextState.stickActive ? 1 : 0;
        view[4] = nextState.aPressed ? 1 : 0;
        view[5] = nextState.bPressed ? 1 : 0;
        // console.log(buffer[0]);
        console.log(new Date());
        ws.send(view);
    }
    return result;
};