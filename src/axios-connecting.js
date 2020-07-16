import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://wonderpad-server.herokuapp.com/:80/connect-request'
});

export default instance;