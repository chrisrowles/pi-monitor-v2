import Swal from 'sweetalert2';

const notify = {};

notify.toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});


notify.send = (type, msg) => {
    notify.toast.fire({
        icon: type,
        title: msg
    }).then(r => { console.log(r)});
}

notify.level = (param, {max, mid, min}) => {
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

export default notify;