import Vue from 'vue'
import Router from 'vue-router'
import CourtGrid from '@/components/CourtGrid'
import NotFound from '@/components/NotFound'
import RegisterMember from '@/components/RegisterMember'
import AddSession from '@/components/AddSession'

Vue.use(Router)

const routes = [
    {
      path: '/',
      name: 'CourtGrid',
      component: CourtGrid
    },
    {
      path: '/members/new',
      name: 'RegisterMember',
      component: RegisterMember
    },
    {
      path: '/sessions/new',
      name: 'AddSession',
      component: AddSession
    },
    {
        path: '*',
        name: 'NotFound',
        component: NotFound
      }
  ]

export default new Router({
  routes,
  mode: 'history'
})