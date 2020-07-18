import { caller, url } from '../api';

/** Live CPU data service **/
const liveCpu = {};

/**
 * Fetch live CPU statistics.
 *
 * @param fields
 * @returns {Promise<number>}
 */
liveCpu.get = async (...fields) => {
    let response = await caller(url + '/system/cpu', {
        headers: { 'X-Fields': fields.join(', ') }
    });
    return response.data.temp;
}

/** Live disk data service **/
const liveDisk = {};

/**
 * Fetch live data statistics.
 *
 * @param fields
 * @returns {Promise<number>}
 */
liveDisk.get = async (...fields) => {
    let response = await caller(url + '/system/disk', {
        headers: { 'X-Fields': fields.join(', ') }
    });
    return response.data.temp;
}

export {
    liveCpu,
    liveDisk
};