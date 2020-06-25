import socket from '../socketIOClient';

export const socketSend = store => next => action => {
    let result = next(action)
    console.log('[MIDDLEWARE] sending input data: ')
    console.log(store.getState());
    //socket.send(store);
    return result;
};