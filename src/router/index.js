import Vue from 'vue'
import VueRouter from 'vue-router'
import Collection from '../views/Collection.vue'
import GinView from '../views/GinView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Collection',
    component: Collection
  },
  {
    path: '/gin/:slug',
    name: 'Single',
    component: GinView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
