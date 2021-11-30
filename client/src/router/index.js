import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/groups',
    name: 'groups',
    component: () => import(/* webpackChunkName: "about" */ '../views/Groups.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "about" */ '../views/Users.vue'),
    //meta: {requireAuth: true}
    meta: {requireAuth: true, requireAdmin: true}
  },
  {
    path: '/tags',
    name: 'tags',
    component: () => import(/* webpackChunkName: "about" */ '../views/Tags.vue'),
    //meta: {requireAuth: true}
    meta: {requireAuth: true, requireAdmin: true}
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  const rutaProtegida = to.matched.some(record => record.meta.requireAuth);
  const rutaAdmin = to.matched.some(record => record.meta.requireAdmin);
  //console.log(store.state.usuarioDB.data.role);
  if(rutaProtegida && store.state.token === '') {
    next({name: 'login'})
  } else {
    //if(rutaAdmin && store.state.usuarioDB.data.role != 'ADMIN'){
    if(rutaAdmin && store.state.usuarioDB.data.role == 'USER'){
      next({name: 'login'})
    }else{
      next();
    }
  }

})

export default router
