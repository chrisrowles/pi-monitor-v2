import api from '../api';

const liveCpu = {};

liveCpu.temp = () => {
    api.get('/system/cpu', {
        headers: { 'X-Fields': 'temp' }
    }).then(response => {
        let x = [new Date().getTime()],
            y = response.data.temp;
        console.log({
            'time': x,
            'value': y
        });
    })
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