import store from '@/store';
import notify from '@/helpers/notify';

export default function auth({ next, router }) {
  if (!store.state.auth) {
    notify.send('error', 'You must log in first.');
    return router.push({ name: 'login' }).catch(e => {
      console.log(e.message);
    });
  }

  return next();
}