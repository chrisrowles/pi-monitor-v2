export default function auth({ next, router }) {
  if (!localStorage.getItem('auth_token')) {
    return router.push({ name: 'login' });
  }

  return next();
}