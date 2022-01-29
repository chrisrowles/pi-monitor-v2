import { caller, url } from './api';

/** Live CPU data service **/
const liveCpu = {};

/**
 * Fetch live CPU statistics.
 *
 * @param field
 * @returns {Promise<number>}
 */
liveCpu.get = async (field) => {
    let response = await caller(url + '/system/cpu', {
        headers: { 'X-Fields': field }
    });
    
    return response.data;
}

/** Live disk data service **/
const liveDisk = {};

/**
 * Fetch live disk statistics.
 *
 * @param field
 * @returns {Promise<number>}
 */
liveDisk.get = async (field) => {
    let response = await caller(url + '/system/disk', {
        headers: { 'X-Fields': field }
    });
    return response.data[field];
}

export {
    liveCpu,
    liveDisk
};