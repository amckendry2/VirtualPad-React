import * as actionTypes from './actionTypes';

export const aDown = () => {
    return {
        type: actionTypes.A_DOWN
    }
};

export const bDown = () => {
    return {
        type: actionTypes.B_DOWN
    }
};

export const buttonRelease = () => {
    return {
        type: actionTypes.BUTTON_RELEASE
    }
};

export const stickMove = (stickDir, stickMag) => {
    return {
        type: actionTypes.STICK_MOVE,
        stickDir: stickDir,
        stickMag: stickMag
    }
}

export const stickRelease = () => {
    return {
        type: actionTypes.STICK_RELEASE
    }
}

