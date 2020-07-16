export const inputStateToBinary = state => {
    const buffer = new ArrayBuffer(12);
    const view = new Uint16Array(buffer);
    view[0] = state.connection.playerNum; 
    view[1] = parseInt(state.input.stickDir);
    view[2] = parseInt(state.input.stickMag);
    view[3] = state.input.stickActive ? 1 : 0;
    view[4] = state.input.aPressed ? 1 : 0;
    view[5] = state.input.bPressed ? 1 : 0;
    return view;
}