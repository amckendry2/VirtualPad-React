const commTypes = {
    INPUT_DATA: Buffer.from([0]),
    CONNECTION_UNSUCCESSFUL: Buffer.from([1]),
    CONNECTION_SUCCESSFUL: Buffer.from([2]),
    CONNECTION_CLOSED: Buffer.from([3]),
    PLAYER_JOINED: Buffer.from([4]),
    PLAYER_LEFT: Buffer.from([5]),
    PING: Buffer.from([6])
}

export const constructMessage = (data, commType) => {
    const dataBytes = objToBytes(data);
    return Buffer.concat([commType, dataBytes]);
};

const objToBytes = obj => Buffer.from(JSON.stringify(obj));

export default commTypes;