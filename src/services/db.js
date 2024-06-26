import axios from "axios";
import auth from "../firebase";

/**
 * @typedef {import("@/types/guest_passes").PassInfo} PassInfo;
 */

const instance = axios.create({
  baseURL: process.env.VUE_APP_BACKEND,
});

instance.interceptors.request.use(
  async (config) => {
    if (auth.currentUser) {
      try {
        const idtoken = await auth.currentUser.getIdToken();
        config.headers.authorization = `Bearer ${idtoken}`;
        return config;
      } catch (err) {
        throw new Error("Unable to retrieve user token");
      }
    } else {
      return config;
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);

function getBookings(date) {
  let url = new URL(process.env.VUE_APP_BACKEND + "/bookings");

  url.searchParams.set("date", date);

  return instance.get(url);
}

function newMatch(matchdata) {
  return instance.post(process.env.VUE_APP_BACKEND + "/bookings", matchdata);
}

function getBookingDetails(id) {
  return instance.get(process.env.VUE_APP_BACKEND + "/bookings/" + id);
}

function endSession(params) {
  return instance.patch(
    process.env.VUE_APP_BACKEND + `/bookings/${params.id}`,
    {
      cmd: {
        name: "END_SESSION",
        params: {
          hash: params.hash,
        },
      },
    }
  );
}

function removeSession(params) {
  return instance.patch(
    process.env.VUE_APP_BACKEND + `/bookings/${params.id}`,
    {
      cmd: {
        name: "REMOVE_SESSION",
        params: {
          hash: params.hash,
        },
      },
    }
  );
}

function changeSessionTime(params) {
  return instance.patch(
    process.env.VUE_APP_BACKEND + `/bookings/${params.id}`,
    {
      cmd: {
        name: "CHANGE_TIME",
        params: {
          hash: params.hash,
          start: params.start,
          end: params.end,
        },
      },
    }
  );
}
function changeCourt(params) {
  return instance.patch(
    process.env.VUE_APP_BACKEND + `/bookings/${params.id}`,
    {
      cmd: {
        name: "CHANGE_COURT",
        params: {
          hash: params.hash,
          court: params.court,
        },
      },
    }
  );
}

function getCourts() {
  return instance.get("/courts");
}

function getMembers() {
  return instance.get(process.env.VUE_APP_BACKEND + "/persons/members");
}

function getActiveMembers() {
  return instance.get(process.env.VUE_APP_BACKEND + "/persons/members/active");
}

function getGuests() {
  return instance.get(process.env.VUE_APP_BACKEND + "/persons/guests");
}

async function addGuest(guest) {
  return await instance.post(
    process.env.VUE_APP_BACKEND + "/persons/guests",
    guest
  );
}

async function getEligiblePersons() {
  return instance.get(process.env.VUE_APP_BACKEND + "/persons/eligible");
}

async function getActivePersons() {
  return instance.get(process.env.VUE_APP_BACKEND + "/persons/active");
}

async function getInactiveGuests() {
  return instance.get(process.env.VUE_APP_BACKEND + "/persons/guests/inactive");
}

async function getCurrentGuestActivations() {
  return instance.get(
    process.env.VUE_APP_BACKEND + "/guest_activations/current"
  );
}

async function deactivateGuest(activation) {
  //Configure patch commands
  const patchcommand = {
    name: "DEACTIVATE",
    params: { etag: activation.etag },
  };

  return instance.patch(
    process.env.VUE_APP_BACKEND + `/guest_activations/${activation.id}`,
    { cmd: patchcommand }
  );
}

/**
 *  Get Booking Types
 */
async function getBookingTypes() {
  return instance.get(process.env.VUE_APP_BACKEND + "/booking_types");
}

/**
 * Get event hosts
 * 
 * @returns {Promise<AxiosResponse<any>>}
 */

async function getEventHosts() {
  return instance.get(process.env.VUE_APP_BACKEND + "/persons/eventhosts");
}

/**
 *
 * @param {Number} memberhost_id ID of the active member host
 * @param {Number[]} guests Array of IDs for inactive guets
 */
async function activateGuests(memberhost_id, guests) {
  return instance.post(
    process.env.VUE_APP_BACKEND + "/guest_activations/bulk",
    { memberhost: memberhost_id, guests: guests }
  );
}

async function checkGeoAuth() {
  return axios.get(process.env.VUE_APP_BACKEND + "/auth/geo");
}

// eslint-disable-next-line no-unused-vars
async function getRecaptchaScore(token) {
  //Build a rest URL and add recaptcha token
  let url = new URL(process.env.VUE_APP_BACKEND + "/auth/recaptchascore");

  url.searchParams.set("token", token);

  const result = await axios.get(url);

  return result.data;
}

async function getCaptcha() {
  let url = new URL(process.env.VUE_APP_BACKEND + "/auth/captcha");

  const result = await axios.get(url);

  return result.data;
}

async function getOverlappingBookings(date, start, end, court) {
  let url = new URL(process.env.VUE_APP_BACKEND + "/bookings/overlapping");

  url.searchParams.set("date", date);
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);
  url.searchParams.set("court", court);

  const result = await instance.get(url);

  return result.data;
}

async function getUserRole() {
  let url = new URL(process.env.VUE_APP_BACKEND + "/auth/user/role");

  const result = await instance.get(url);

  return result.data;
}

async function getUserProfile() {
  let url = new URL(process.env.VUE_APP_BACKEND + "/auth/user/profile");

  const result = await instance.get(url);

  return result.data;
}

async function checkConnection() {
  let url = new URL(process.env.VUE_APP_BACKEND + "/alive");

  const result = await axios.get(url);

  return result.data;
}

async function getClubSchedule() {
  let url = new URL(process.env.VUE_APP_BACKEND + "/club_schedule");

  const result = await instance.get(url);

  return result.data;
}

async function getClubInfo() {
  let url = new URL(process.env.VUE_APP_BACKEND + "/club");

  const result = await axios.get(url);

  return result.data;
}

async function runReport(name, from, to) {
  let url = new URL(process.env.VUE_APP_BACKEND + `/reports/${name}`);

  //If from is set but to is not, set to to from
  if (from && !to) {
    to = from;
  } else if (!from && to) {
    from = to;
  }

  //if from and to are set, add them to the url
  if (from != null && to != null) {
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
  }

  const result = await instance.get(url);

  return result;
}

async function getActivitiesForDates(from, to) {
  let url = new URL(process.env.VUE_APP_BACKEND + "/activities");

  //If from is set but to is not, set to to from
  if (from && !to) {
    to = from;
  } else if (!from && to) {
    from = to;
  }

  //if from and to are set, add them to the url
  if (from != null && to != null) {
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
  }

  const result = await instance.get(url);

  return result.data;
}

/**
 *
 * @param {PassInfo} passInfo
 * @returns {Promise<AxiosResponse<any>>}
 */
async function createGuestPass(passInfo) {
  return instance.post(process.env.VUE_APP_BACKEND + "/guest_passes", {
    host: passInfo.host,
    guest: passInfo.guest,
    pass_type: passInfo.pass_type,
  });
}

async function getGuestPassTypes() {
  return instance.get(process.env.VUE_APP_BACKEND + "/guest-pass-types");
}

async function getPaymentTypes() {
  return instance.get(process.env.VUE_APP_BACKEND + "/payment-types");
}

export default {
  getBookings,
  newMatch: newMatch,
  getBookingDetails,
  endSession: endSession,
  removeSession: removeSession,
  changeTime: changeSessionTime,
  changeCourt,
  getCourts,
  getMembers,
  getGuests,
  addGuest,
  getEligiblePersons,
  getActivePersons,
  getInactiveGuests,
  activateGuests,
  getCurrentGuestActivations,
  getBookingTypes,
  checkGeoAuth,
  getRecaptchaScore,
  getCaptcha,
  deactivateGuest,
  getOverlappingBookings,
  getUserRole,
  getUserProfile,
  getActiveMembers,
  checkConnection,
  getClubSchedule,
  getClubInfo,
  runReport,
  getActivitiesForDates,
  createGuestPass,
  getGuestPassTypes,
  getPaymentTypes,
  getEventHosts,
};
