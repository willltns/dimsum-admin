import loadable from '@loadable/component'
import { userRoleMap } from '@/consts'

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
    accessRole: [userRoleMap.auditor, userRoleMap.god],
    component: loadableWithSpinner(() => import('../pages/auto-vote')),
  },
  {
    path: '/advert',
    exact: true,
    accessRole: [userRoleMap.auditor, userRoleMap.god],
    component: loadableWithSpinner(() => import('../pages/advert')),
  },
  {
    path: '/promo-request',
    exact: true,
    accessRole: [userRoleMap.auditor, userRoleMap.god],
    component: loadableWithSpinner(() => import('../pages/promo-request')),
  },
  {
    path: '/vote-promo',
    exact: true,
    accessRole: [userRoleMap.auditor, userRoleMap.god],
    component: loadableWithSpinner(() => import('../pages/vote-promo')),
  },
  {
    path: '/mi-user',
    exact: true,
    accessRole: [userRoleMap.god],
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
