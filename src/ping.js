import bus from "./bus";

const ping = {};

ping.api = () => {
    fetch('http://rowles.ddns.net:8888/network/ping').then(response => {
        console.log(response);
        console.log(response.json());
        if (!response.ok) {
            bus.$emit('api-disconnect');
        } else {
            bus.$emit('api-reconnect');
        }
    }).catch(() => {
        bus.$emit('api-disconnect');
    })
};

export default ping;