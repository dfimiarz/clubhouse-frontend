import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import TokenView from '@/components/Token'
const RegisterGuest = () => import(/* webpackChunkName: "member" */ '@/components/RegisterGuest')
const GuestManager = () => import(/* webpackChunkName: "member" */ '@/components/GuestManager')
const GuestInfo = () => import(/* webpackChunkName: "member" */ '@/components/GuestInfo')
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
      path: '/guests',
      component: GuestManager,
      children: [
        {
          path : '',
          component: RegisterGuest,
          name: 'guestregistration',
        },
        {
          path : 'register',
          component: GuestInfo,
          name: 'guestinfo',
        }
      ]
    },
    {
      path: '/token',
      name: 'token',
      component: TokenView
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