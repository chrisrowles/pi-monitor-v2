import { caller, url } from '../api';

const liveCpu = {};
liveCpu.get = async (...fields) => {
    let response = await caller(url + '/system/cpu', {
        headers: { 'X-Fields': fields.join(', ') }
    });
    return response.data.temp;
}

const liveDisk = {};
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