import * as actionTypes from './actionTypes';

export const aDown = () => {
    return {
        type: actionTypes.A_DOWN,
        sendInputState: true
    };
};

export const bDown = () => {
    return {
        type: actionTypes.B_DOWN,
        sendInputState: true
    };
};

export const buttonRelease = () => {
    return {
        type: actionTypes.BUTTON_RELEASE,
        sendInputState: true
    };
};

export const stickMove = (stickDir, stickMag) => {
    return {
        type: actionTypes.STICK_MOVE,
        stickDir: stickDir,
        stickMag: stickMag,
        sendInputState: true
    };
}

export const stickRelease = () => {
    return {
        type: actionTypes.STICK_RELEASE,
        sendInputState: true
    };
}

