import api, {url} from '../api';
import { caller } from '../api';

const liveCpu = {};

liveCpu.temp = async () => {
    let response = await caller(url + '/system/cpu', {
        headers: { 'X-Fields': 'temp' }
    });
    return response.data.temp;
}

liveCpu.usage = () => {
    api.get('/system/cpu', {
        headers: { 'X-Fields': 'usage' }
    }).then(response => {
        let x = [new Date().getTime()],
            y = response.data.usage;
        console.log({
            'time': x,
            'value': y
        });
    })
}

export {
    liveCpu
};