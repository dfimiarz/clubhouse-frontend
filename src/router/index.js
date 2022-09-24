import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import NotFound from "@/components/NotFound";
import LoginView from "@/components/Login";
import store from "../store";

import checkRouteAccess, { ACCESS_ERRORS } from "@/utils/RouteAccessChecker";

const GuestCreator = () =>
  import(/* webpackChunkName: "guest" */ "@/components/guests/GuestCreator");
const GuestManager = () =>
  import(/* webpackChunkName: "guest" */ "@/components/guests/GuestManager");
const GuestActivation = () =>
  import(/* webpackChunkName: "guest" */ "@/components/guests/GuestActivation");
const ActiveGuestList = () =>
  import(/* webpackChunkName: "guest" */ "@/components/guests/ActiveGuestList");
const MatchCalendar = () =>
  import(/* webpackChunkName: "calendar" */ "@/components/MatchCalendar");
const MatchBooking = () =>
  import(/* webpackChunkName: "booking" */ "@/components/MatchBooking");
const BookingDetails = () =>
  import(/* webpackChunkName: "details" */ "@/components/BookingDetails");
const EventBooking = () =>
  import(/* webpackChunkName: "manage" */ "@/components/EventBooking");
const Settings = () =>
  import(/* webpackChunkName: "settings" */ "@/components/Settings");
const CourtReports = () =>
  import(/* webpackChunkName: "reports" */ "@/components/reports/CourtReports");
const PlayerReports = () =>
  import(
    /* webpackChunkName: "reports" */ "@/components/reports/PlayerReports"
  );
const AdminHome = () =>
  import(/* webpackChunkName: "admin" */ "@/components/AdminHome");

import LoadingScreen from "@/components/LoadingScreen";
import { Role } from "../constants/constants";

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminHome,
    meta: {
      authReq: true,
      allowedRoles: [Role.MANAGER, Role.SUPERUSER],
    },
  },
  {
    path: "/admin/reports/courts",
    name: "CourtReports",
    component: CourtReports,
    meta: {
      authReq: true,
      allowedRoles: [Role.MANAGER, Role.SUPERUSER],
    },
  },
  {
    path: "/admin/reports/players",
    name: "PlayerReports",
    component: PlayerReports,
    meta: {
      authReq: true,
      allowedRoles: [Role.MANAGER, Role.SUPERUSER],
    },
  },
  {
    path: "/guests",
    component: GuestManager,
    children: [
      {
        path: "",
        component: GuestCreator,
        name: "guestregistration",
      },
      {
        path: "activate",
        component: GuestActivation,
        name: "guestactivation",
        meta: {
          authReq: true,
          allowedRoles: [],
        },
      },
      {
        path: "active",
        component: ActiveGuestList,
        name: "activeguests",
        meta: {
          authReq: true,
          allowedRoles: [],
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    beforeEnter: (to, from, next) => {
      if (store.getters["userstore/user"]) {
        next({ name: "home" });
      } else {
        next();
      }
    },
  },
  {
    path: "/calendar",
    name: "calendar",
    component: MatchCalendar,
    meta: {
      authReq: true,
      allowedRoles: [],
    },
  },
  {
    path: "/bookings/matches/new",
    name: "MatchBooking",
    component: MatchBooking,
    meta: {
      authReq: true,
      allowedRoles: [],
    },
    props: (route) => {
      const _req_players =
        typeof route.query.pls === "string"
          ? route.query.pls.split(",", 4).reduce((acc, val) => {
              const parsedval = parseInt(val);

              if (!isNaN(parsedval)) {
                acc.push(parsedval);
              }

              return acc;
            }, [])
          : null;

      return {
        req_players: _req_players,
        req_bookingtype: route.query.bt || null,
      };
    },
  },
  {
    path: "/admin/manage/eventbooking",
    name: "EventBooking",
    component: EventBooking,
    meta: {
      authReq: true,
      allowedRoles: [Role.MANAGER, Role.SUPERUSER, Role.PRO],
    },
  },
  {
    path: "/bookings/:id",
    name: "BookingDetails",
    component: BookingDetails,
    props: true,
    meta: {
      authReq: true,
      allowedRoles: [],
    },
  },
  {
    path: "/settigns",
    name: "settings",
    component: Settings,
    props: true,
    meta: {
      authReq: true,
      allowedRoles: [Role.MANAGER, Role.SUPERUSER],
    },
  },
  {
    path: "/error",
    name: "error",
    component: LoadingScreen,
    props: true,
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
  },
];

let router = new Router({
  routes,
  mode: "history",
});

/**
 *
 * @param {Route} to Route
 * @param {function} next Next function
 *
 * Function checks if route navigated to requires authentication and redirects to login if needed.
 */
function checkAuthRoutes(to, next) {
  const { granted, error } = checkRouteAccess(to);

  if (granted) {
    next();
  } else {
    switch (error) {
      case ACCESS_ERRORS.AUTH_REQ:
        next("/login");
        break;
      case ACCESS_ERRORS.ROLE_REQ:
        store.dispatch("notificationstore/addNotification", {
          text: `Insufficient role to access "${to.name}"`,
          type: "error",
        });
        next("/");
        break;
      default:
        store.dispatch("notificationstore/addNotification", {
          text: `Unknown routing error`,
          type: "error",
        });
        next("/");
        break;
    }
  }
}

router.beforeEach((to, from, next) => {
  //If app is not active, run init action
  if (!store.getters["appActive"]) {
    store
      .dispatch("initializeAppState")
      .then(() => {
        checkAuthRoutes(to, next);
      })
      .catch((err) => {
        store.dispatch("setLoadingError", err.message);
        next(false);
      })
      .finally(() => {});
  } else {
    checkAuthRoutes(to, next);
  }
});

router.onError((err) => {
  console.log(err.message);
});

export default router;
