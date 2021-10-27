import loadable from '@loadable/component'

const loadableWithSpinner = (comp) => loadable(comp)

const routes = [
  {
    path: '/coin',
    exact: true,
    component: loadableWithSpinner(() => import('../pages/coin')),
  },
  {
    path: '/auto-vote',
    exact: true,
    component: loadableWithSpinner(() => import('../pages/auto-vote')),
  },
  {
    path: '/advert',
    exact: true,
    component: loadableWithSpinner(() => import('../pages/advert')),
  },
  {
    path: '/vote-promo',
    exact: true,
    component: loadableWithSpinner(() => import('../pages/vote-promo')),
  },
  {
    path: '/mi-user',
    exact: true,
    component: loadableWithSpinner(() => import('../pages/mi-user')),
  },
  /*{
    path: "/ui-user",
    exact: true,
    component: loadableWithSpinner(() => import("../pages/ui-user")),
  },*/
  {
    path: '*',
    redirectTo: '/coin',
  },
]

export default routes
