import bus from './util/bus';

const url = 'http://rowles.ddns.net:8888';
const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json'
};

let connected = true
const caller = (uri, options = {}) => {
    options.headers = headers;
    return new Promise((resolve, reject) => {
        fetch(uri, options).then(response => {
            if (!connected) bus.$emit('api-reconnect');
            connected = true;
            if (response.ok) {
                return resolve(response.json());
            } else {
                return reject(response);
            }
        }).catch(() => {
            connected = false;
            bus.$emit('api-disconnect');
        });
    });
}

const api = {};
api.get = async (endpoint) => {
    let response = await caller(url + endpoint);
    return response;
}

api.ping = () => {
    caller(url + '/network/ping');
}

setInterval(api.ping, 45000);

export default api;