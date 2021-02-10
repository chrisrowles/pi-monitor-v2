import notify from "@/helpers/notify";
import store from "@/services/store";

export default function auth({ next, router }) {
  if (!store.state.token) {
    notify.send('error', 'You must log in first.');
    return router.push({ name: 'login' }).catch(e => {
      console.log(e.message)
    });
  }

  return next();
}