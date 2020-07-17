import bus from './services/event-bus';

const url = process.env.VUE_APP_API_URL;
const defaultHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json'
};

let connected = true
const caller = (uri, options = {}) => {
    if (options.headers) {
        Object.assign(defaultHeaders, options.headers)
    }
    let headers = new Headers();
    Object.keys(defaultHeaders).forEach(key => {
        headers.append(key, defaultHeaders[key])
    })
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
api.get = async (endpoint, options = {}) => {
    let response = await caller(url + endpoint, options);
    return response;
}

api.ping = () => {
    caller(url + '/network/ping');
}

setInterval(api.ping, 45000);

export {
    url,
    caller
};

export default api;