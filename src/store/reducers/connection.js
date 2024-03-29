import * as actionTypes from '../actions/actionTypes';

const initialState = {
    // unityConnection: false,
    serverConnection: false,
    connecting: false,
    error: null,
    playerNum: null
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.REQUEST_START: return requestStart(state); 
        case actionTypes.REQUEST_SUCEEDED: return requestSucceeded(state, action.playerNum);
        case actionTypes.REQUEST_FAILED: return requestFailed(state, action.error);
        case actionTypes.WS_CONNECTED: return wsConnected(state);
        case actionTypes.WS_ERROR: return wsError(state, action.error);
        case actionTypes.WS_DISCONNECTED: return wsDisconnected(state);
        // case actionTypes.UNITY_CONNECT_SUCCEEDED: return unityConnectSucceeded(state);
        // case actionTypes.UNITY_CONNECT_FAILED: return unityConnectFailed(state, error);
        default: return state;
    }
}

const requestStart = state => ({
    ...state,
    connecting: true,
    error: null
});

const requestSucceeded = (state, playerNum) => ({
    ...state,
    playerNum: playerNum
})

const requestFailed = (state, error) => ({
    ...state,
    connecting: false,
    error: error
});

const wsConnected = state => ({
    ...state,
    serverConnection: true,
    connecting: false
});

const wsError = (state, error) => ({
    ...state,
    error: error
});

const wsDisconnected = state => ({
    ...state,
    serverConnection: false,
    connecting: false
});

// const unityConnectSucceeded = state => ({
//     ...state,
//     unityConnection: true,
//     connecting: false    
// });

// const unityConnectFailed = state => ({
//     ...state,
//     connecting: false,
//     error: error
// });

export default reducer;