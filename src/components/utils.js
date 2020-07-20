const util = {};

util.computeDisplayClass = (param, {max, mid, min}) => {
    if (param >= max) {
        return 'bg-success';
    } else if (param < max && param >= mid) {
        return 'bg-warning';
    } else if (param < mid && param > min) {
        return 'bg-danger';
    } else {
        return 'bg-dark';
    }
}

export default util;