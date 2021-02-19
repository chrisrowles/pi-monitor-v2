import Swal from 'sweetalert2';

const notify = {};

notify.toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 10000,
    timerProgressBar: true,
    showClass: {
        popup: '',
    },
    hideClass: {
        popup: ''
    },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});


notify.send = (type, msg) => {
    notify.toast.fire({
        icon: type,
        title: msg
    });
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