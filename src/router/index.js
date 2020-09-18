import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import TokenView from '@/components/Token'
const GuestCreator = () => import(/* webpackChunkName: "guest" */ '@/components/guests/GuestCreator')
const GuestManager = () => import(/* webpackChunkName: "guest" */ '@/components/guests/GuestManager')
const GuestActivation = () => import(/* webpackChunkName: "guest" */ '@/components/guests/GuestActivation')
const ActiveGuestList = () => import(/* webpackChunkName: "guest" */ '@/components/guests/ActiveGuestList')
const MatchCalendar = () => import(/* webpackChunkName: "calendar" */ '@/components/MatchCalendar')
const SessionBooking = () => import(/* webpackChunkName: "booking" */ '@/components/SessionBooking')
const SessionDetails = () => import(/* webpackChunkName: "details" */ '@/components/SessionDetails')
import store from '@/store/index'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/guests',
    component: GuestManager,
    children: [
      {
        path: '',
        component: GuestCreator,
        name: 'guestregistration',
      },
      {
        path: 'activate',
        component: GuestActivation,
        name: 'guestactivation',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'active',
        component: ActiveGuestList,
        name: 'activeguests',
        meta: {
          requiresAuth: true
        }
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
    component: MatchCalendar,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/sessions/new',
    name: 'SessionBooking',
    component: SessionBooking,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/sessions/:id',
    name: 'SessionDetails',
    component: SessionDetails,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

let router = new Router({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.token) {
      next();
    }
    else {
      next('/token');
    }
  } else {
    next()
  }
})

export default router