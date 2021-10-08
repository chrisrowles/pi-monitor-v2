import bus from './bus';
import store from '@/store';

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
  options.headers = { ...defaultHeaders, ...options.headers };

  const headers = new Headers();
  Object.keys(defaultHeaders).forEach((key) => headers.append(key, defaultHeaders[key]));

  // Authorization interceptor
  if (store.getters.isAuthorized) {
    headers.append('Authorization', store.state.auth);
  }

  options.headers = headers;

  return new Promise((resolve, reject) => {
    fetch(uri, options).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (!connected) {
        bus.$emit('api-reconnect');
      }
      connected = true;

      return response.ok ? resolve(response.json()) : reject(response);
    }).catch(() => {
      connected = false;

      bus.$emit('api-disconnect');
    });
  });
};

/** API client **/
const api = {};

/**
 * Fetch from the API.
 *
 * @param endpoint
 * @param options
 * @returns {Promise<unknown>}
 */
api.request = async (endpoint, options = {}) => caller(url + endpoint, options);

/**
 * Ping the API for connection status.
 *
 * @param timeout
 * @returns {NodeJS.Timer}
 */
api.ping = timeout => {
  return setInterval(() => {
      caller(url + '/network/ping').then(response => {
        if (response.status !== 'connected') {
          bus.$emit('api-disconnect');
        }
      });
    }, timeout);
}
api.ping(30000);

export {
  url,
  caller,
  defaultHeaders
};

export default api;