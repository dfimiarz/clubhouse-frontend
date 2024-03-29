import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import LoginView from '@/components/Login'
import store from '../store'
const GuestCreator = () => import(/* webpackChunkName: "guest" */ '@/components/guests/GuestCreator')
const GuestManager = () => import(/* webpackChunkName: "guest" */ '@/components/guests/GuestManager')
const GuestActivation = () => import(/* webpackChunkName: "guest" */ '@/components/guests/GuestActivation')
const ActiveGuestList = () => import(/* webpackChunkName: "guest" */ '@/components/guests/ActiveGuestList')
const MatchCalendar = () => import(/* webpackChunkName: "calendar" */ '@/components/MatchCalendar')
const MatchBooking = () => import(/* webpackChunkName: "booking" */ '@/components/MatchBooking')
const BookingDetails = () => import(/* webpackChunkName: "details" */ '@/components/BookingDetails')
const EventBooking = () => import(/* webpackChunkName: "manage" */ '@/components/EventBooking')
const Settings = () => import(/* webpackChunkName: "settings" */ '@/components/Settings')
// import Error from "@/components/Error";
import LoadingScreen from "@/components/LoadingScreen";

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
    component: LoginView,
    beforeEnter: (to,from,next) => {
      if( store.getters["userstore/user"]){
        next({ name: "home"});
      } else {
        next();
      }
    }
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
    },
    props: route => {

      const _req_players = typeof route.query.pls === "string" ? route.query.pls.split(',',4).reduce((acc,val) => {
        const parsedval = parseInt(val);
      
        if( ! isNaN(parsedval)){
          acc.push(parsedval);
        }

        return acc;
      },[]) : null;     

      return { 
        req_players: _req_players,
        req_bookingtype: route.query.bt || null
      }
      
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
    path: '/settigns',
    name: 'settings',
    component: Settings,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/error',
    name: 'error',
    component: LoadingScreen,
    props: true,
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

/**
 * 
 * @param {Route} to Route
 * @param {function} next Next function
 * 
 * Function checks if route navigated to requires authentication and redirects to login if needed.
 */
function checkAuthRoutes(to,next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['userstore/isAuthenticated']) {
      next();
    }
    else {
      next('/login');
    }
  }
  else {
      next();
  }
}

router.beforeEach((to, from, next) => {

  //If app is not active, run init action
  if( ! store.getters['appActive']){

      store.dispatch("initializeApplication")
      .then(() => {
        checkAuthRoutes(to,next);
      })
      .catch((err) =>{
        store.dispatch("setLoadingError",err.message)
        next(false);
      })
      .finally(() => {
        
      })

  }
  else {
      checkAuthRoutes(to,next);
  }
})

router.onError((err) => {
  console.log(err.message)
})

export default router