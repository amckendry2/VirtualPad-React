import * as actionTypes from './actionTypes';
import axios from '../../axios-connecting';

export const requestStart = () => {
    return {
        type: actionTypes.REQUEST_START
    };
};

export const requestFailed = (err) => {
    return {
        type: actionTypes.REQUEST_FAILED,
        error: err
    };
};

export const requestValidation = (gameCode) => {
    return dispatch => {
        dispatch(requestStart());
        const url = 'http://127.0.0.1:4000/validation-request';
        // const mobileURL = 'http://10.84.1.128:4000/connection-request';
        axios.post(url, gameCode)
            .then ( res => {
                console.log('connection request validated');
                // dispatch(requestSucceeded());
                dispatch(wsConnect(res.data));
                // dispatch(unityConnectRequest(gameCode));
            })
            .catch ( err => {
                console.log(err);
                dispatch(requestFailed(err));
            });
    };
};

export const wsConnect = host => ({ 
    type: actionTypes.WS_CONNECT, 
    host: host
});

export const wsConnected = () => ({
    type: actionTypes.WS_CONNECTED
});

export const wsError = (error) => ({
 type: actionTypes.WS_ERROR,
 error: error
})

export const wsDisconnect = error => ({
    type: actionTypes.WS_DISCONNECT,
    error: error
});

export const wsDisconnected = () => ({
    type: actionTypes.WS_DISCONNECTED
});

// export const unityConnectRequest = (gameCode) => {
//     return dispatch => {
//         dispatch(unityConnectStart())
//         const url = 'http://127.0.0.1:4000/connection-request'
//         axios.post(url, gameCode)
//             .then( res => {
//                 console.log(res.data);
//                 dispatch(unityConnectSucceeded());
//             })
//             .catch( err => {
//                 console.log(err);
//                 dispatch(unityConnectFailed(err));
//             });
//     };
// };

// export const unityConnectStart = () => ({
//     type: actionTypes.UNITY_CONNECT_START
// });

// export const unityConnectSucceeded = () => ({
//     type: actionTypes.UNITY_CONNECT_SUCCEEDED
// });

// export const unityConnectFailed = () => ({
//     type: actionTypes.UNITY_CONNECT_FAILED
// });
