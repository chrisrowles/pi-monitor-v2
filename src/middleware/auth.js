import store from '@/store';
import notify from '@/helpers/notify';

export default function auth({ next, router }) {
  if (!store.getters.isAuthorized) {
    notify.send('error', 'You must log in first.');

    return router.push({ name: 'login' }).catch(() => {
      notify.send('error', 'An error occurred, please try logging in again..');
    });
  }

  return next();
}