import util from "@/components/utils";

export default function auth({ next, router }) {
  if (!localStorage.getItem('auth')) {
    util.notify('error', 'You must log in first.');
    return router.push({ name: 'login' }).catch(e => {
      console.log(e.message)
    });
  }

  return next();
}