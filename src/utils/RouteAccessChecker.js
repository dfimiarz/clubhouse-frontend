import store from "../store";
import Route from "vue-router";

export const ACCESS_ERRORS = {
  NO_ERROR: 0,
  AUTH_REQ: 1000,
  ROLE_REQ: 2000,
};

/**
 *
 * @param {Route} to Route to check access to
 * @returns
 */
function checkRouteAccess(to) {
  //Get the last child route record
  const routeRec = to.matched[to.matched.length - 1];

  //Check for meta property on the route record
  const routeRecMeta = Object.prototype.hasOwnProperty.call(routeRec, "meta")
    ? routeRec.meta
    : {};

  //Get authReq
  const authReq = Object.prototype.hasOwnProperty.call(routeRecMeta, "authReq")
    ? routeRecMeta.authReq
    : false;

  //Get allowedRoles
  const allowedRoles = Object.prototype.hasOwnProperty.call(
    routeRecMeta,
    "allowedRoles"
  )
    ? routeRecMeta.allowedRoles
    : [];

  if (!authReq) {
    return { granted: true, error: ACCESS_ERRORS.NO_ERROR };
  }

  if (!store.getters["userstore/isAuthenticated"]) {
    return { granted: false, error: ACCESS_ERRORS.AUTH_REQ };
  }

  //Check if roles are required
  if (allowedRoles.length === 0) {
    return { granted: true, error: ACCESS_ERRORS.NO_ERROR };
  }

  //Get user role
  const userRole = store.getters["userstore/role"];

  if (allowedRoles.some((role) => role === userRole)) {
    return { granted: true, error: ACCESS_ERRORS.NO_ERROR };
  } else {
    return { granted: false, error: ACCESS_ERRORS.ROLE_REQ };
  }
}

export default checkRouteAccess;

// ===Original code===
// //Get the last child route record
// const routeRec = to.matched[to.matched.length - 1];

// //Check for meta property on the route record
// const routeRecMeta = Object.prototype.hasOwnProperty.call(routeRec, "meta")
//   ? routeRec.meta
//   : {};

// //Get authReq
// const authReq = Object.prototype.hasOwnProperty.call(routeRecMeta, "authReq")
//   ? routeRecMeta.authReq
//   : false;

// //Get allowedRoles
// const allowedRoles = Object.prototype.hasOwnProperty.call(
//   routeRecMeta,
//   "allowedRoles"
// )
//   ? routeRecMeta.allowedRoles
//   : [];

// //Check if authentication is required
// if (authReq) {
//   if (store.getters["userstore/isAuthenticated"]) {
//     //Check if roles are required
//     if (allowedRoles.length !== 0) {
//       //Get user role
//       const userRole = store.getters["userstore/role"];

//       if (allowedRoles.some((role) => role === userRole)) {
//         next();
//       } else {
//         store.dispatch("notificationstore/addNotification", {
//           text: `Insufficient role to access "${to.name}"`,
//           type: "error",
//         });
//         next("/");
//       }
//     } else {
//       next();
//     }
//   } else {
//     next("/login");
//   }
// } else {
//   next();
// }
