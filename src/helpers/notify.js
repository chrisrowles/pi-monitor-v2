import Swal from "sweetalert2";

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

export default notify;