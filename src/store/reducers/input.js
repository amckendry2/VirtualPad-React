import * as actionTypes from '../actions/actionTypes';

const initialState = {
    aPressed: false,
    bPressed: false,
    stickActive: false,
    stickDir: 0,
    stickMag: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.A_DOWN: return aDown(state);
        case actionTypes.B_DOWN: return bDown(state);
        case actionTypes.BUTTON_RELEASE: return buttonRelease(state);
        case actionTypes.STICK_MOVE: return stickMove(state, action);
        case actionTypes.STICK_RELEASE: return stickRelease(state);
        default: return state;
    }
}

const aDown = (state) => {
    return {
        ...state,
        aPressed: true,
        bPressed: false
    }
}

const bDown = (state) => {
    return {
        ...state,
        aPressed: false,
        bPressed: true
    }
}

const buttonRelease = (state) => {
    return {
        ...state,
        aPressed: false,
        bPressed: false
    }
}

const stickMove = (state, action) => {
    return {
        ...state,
        stickActive: true,
        stickDir: action.stickDir, 
        stickMag: action.stickMag
    }
}

const stickRelease = (state) => {
    return {
        ...state,
        stickActive: false,
        stickDir: 0,
        stickMag: 0
    }
}

export default reducer;