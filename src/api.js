import bus from './bus';

/** Set the API url and default request headers **/
const url = process.env.VUE_APP_API_URL;
const defaultHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json'
};

/** Flag for API connection **/
let connected = true

/**
 * API caller.
 *
 * Requests routed through here are intercepted and modified with default headers
 * and any other options passed. This method also simplifies the promise chain.
 *
 * @param uri
 * @param options
 * @returns {Promise<unknown>}
 */
const caller = (uri, options = {}) => {
    if (options.headers) {
        // Append extra headers to the default headers.
        Object.assign(defaultHeaders, options.headers)
    }
    let headers = new Headers();
    Object.keys(defaultHeaders).forEach(key => {
        headers.append(key, defaultHeaders[key])
    })
    options.headers = headers;

    return new Promise((resolve, reject) => {
        fetch(uri, options).then(response => {
            if (!connected) {
                // If recovering from a disconnect
                // then emit an API reconnect event.
                bus.$emit('api-reconnect');
            }
            connected = true;
            if (response.ok) {
                return resolve(response.json());
            } else {
                return reject(response);
            }
        }).catch(() => {
            // If we're disconnected from the API
            // then emit an API disconnect event.
            connected = false;
            bus.$emit('api-disconnect');
        });
    });
}

/** API client **/
const api = {};

/**
 * Fetch from the API.
 *
 * @param endpoint
 * @param options
 * @returns {Promise<unknown>}
 */
api.get = async (endpoint, options = {}) => {
    let response = await caller(url + endpoint, options);
    return response;
}

/**
 * Ping the API for connection status.
 *
 * @param timeout
 * @returns {number}
 */
api.ping = timeout => {
    let status =  setInterval(() => {
        caller(url + '/network/ping').then(response => {
            if (response.status !== 'connected') {
                bus.$emit('api-disconnect');
            }
        });
    }, timeout);
    return status;
}
api.ping(30000);

export {
    url,
    caller
};

export default api;