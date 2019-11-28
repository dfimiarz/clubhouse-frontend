import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
const RegisterMember = () => import(/* webpackChunkName: "member" */ '@/components/RegisterMember')
const MemberManager = () => import(/* webpackChunkName: "member" */ '@/components/MemberManager')
//const QuickMatchBooking = () => import (/* webpackChunkName: "group-foo" */ '@/components/QuickMatchBooking')
const MatchCalendar = () => import (/* webpackChunkName: "calendar" */ '@/components/MatchCalendar')
const AdminBooking = () => import (/* webpackChunkName: "booking" */ '@/components/AdminBooking')
const SessionDetails = () => import (/* webpackChunkName: "details" */ '@/components/SessionDetails')

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
      path: '/sessions',
      name: 'calendar',
      component: MatchCalendar
    },
    {
      path: '/sessions/new',
      name: 'AdminBooking',
      component: AdminBooking
    },
    // {
    //   path: '/sessions/quickbook',
    //   name: 'QuickBooking',
    //   component: QuickMatchBooking
    // },
    {
      path: '/sessions/:id',
      name: 'SessionDetails',
      component: SessionDetails,
      props: true
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