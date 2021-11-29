import Vue from 'vue'
import Router from 'vue-router'

import store from './store'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import('@/views/dashboard/Index'),
    children: [
      // Dashboard
      {
        name: 'Dashboard',
        path: '',
        component: () => import('@/views/dashboard/Dashboard'),
      },
      // Pages
      {
        name: 'User Profile',
        path: 'pages/user',
        component: () => import('@/views/dashboard/pages/UserProfile'),
        meta: { requireAuth: true },
      },
      {
        name: 'Profile',
        path: 'profiles/profile',
        component: () => import('@/views/dashboard/pages/Profile'),
        meta: { requireAuth: true },
      },
      {
        name: 'Profiles',
        path: 'profiles/profiles',
        component: () => import('@/views/dashboard/pages/Profiles'),
        meta: { requireAuth: true },
      },
      {
        name: 'Notifications',
        path: 'components/notifications',
        component: () => import('@/views/dashboard/component/Notifications'),
      },
      {
        name: 'Icons',
        path: 'components/icons',
        component: () => import('@/views/dashboard/component/Icons'),
      },
      {
        name: 'Typography',
        path: 'components/typography',
        component: () => import('@/views/dashboard/component/Typography'),
      },
      // Tables
      {
        name: 'Regular Tables',
        path: 'tables/regular-tables',
        component: () => import('@/views/dashboard/tables/RegularTables'),
      },
      // Maps
      {
        name: 'Google Maps',
        path: 'maps/google-maps',
        component: () => import('@/views/dashboard/maps/GoogleMaps'),
      },
      // Upgrade
      {
        name: 'Upgrade',
        path: 'upgrade',
        component: () => import('@/views/dashboard/Upgrade'),
      },
      // Login
      {
        name: 'login',
        path: 'login',
        component: () => import('@/views/dashboard/Login'),
      },
    ],
  },
]

// export default new Router({
const router = new Router({
  // mode: 'hash',
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const rutaProtegida = to.matched.some(record => record.meta.requireAuth)
  const rutaAdmin = to.matched.some(record => record.meta.requireAdmin)
  // console.log(store.state.usuarioDB.data.role);
  if (rutaProtegida && store.state.token === '') {
    next({ name: 'login' })
  } else {
    // if(rutaAdmin && store.state.usuarioDB.data.role != 'ADMIN'){
    if (rutaAdmin && store.state.usuarioDB.data.role === 'USER') {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})

export default router
