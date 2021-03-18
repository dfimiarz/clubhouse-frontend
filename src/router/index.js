import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import LoginView from '@/components/Login'
const GuestCreator = () => import(/* webpackChunkName: "guest" */ '@/components/guests/GuestCreator')
const GuestManager = () => import(/* webpackChunkName: "guest" */ '@/components/guests/GuestManager')
const GuestActivation = () => import(/* webpackChunkName: "guest" */ '@/components/guests/GuestActivation')
const ActiveGuestList = () => import(/* webpackChunkName: "guest" */ '@/components/guests/ActiveGuestList')
const MatchCalendar = () => import(/* webpackChunkName: "calendar" */ '@/components/MatchCalendar')
const MatchBooking = () => import(/* webpackChunkName: "booking" */ '@/components/MatchBooking')
const BookingDetails = () => import(/* webpackChunkName: "details" */ '@/components/BookingDetails')
const EventBooking = () => import(/* webpackChunkName: "manage" */ '@/components/EventBooking')
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
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: MatchCalendar,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/bookings/matches/new',
    name: 'MatchBooking',
    component: MatchBooking,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/manage/eventbooking',
    name: 'EventBooking',
    component: EventBooking,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/bookings/:id',
    name: 'BookingDetails',
    component: BookingDetails,
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
    if (store.state.userstore.user || store.state.userstore.geoauth) {
      next();
    }
    else {
      next('/login');
    }
  } else {
    next()
  }
})

export default router