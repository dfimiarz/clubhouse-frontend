import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import RegisterMember from '@/components/RegisterMember'
import MemberManager from '@/components/MemberManager'
import AddSession from '@/components/AddSession'

Vue.use(Router)

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/members',
      component: MemberManager,
      children: [
        {
          path : '',
          component: RegisterMember,
          name: 'ManageMembers',
        },
        {
          path : 'new',
          component: RegisterMember
        }
      ]
    },
    {
      path: '/sessions/new',
      name: 'NewBooking',
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