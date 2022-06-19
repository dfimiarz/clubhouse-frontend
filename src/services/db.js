import axios from "axios";
import auth from "../firebase";

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
 * Get club managers
 */
async function getManagers() {
  return instance.get(
    process.env.VUE_APP_BACKEND + "/persons/members/managers"
  );
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

async function getClubConfig() {
  let url = new URL(process.env.VUE_APP_BACKEND + "/club_schedule");

  const result = await axios.get(url);

  return result.data;
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
  getInactiveGuests,
  activateGuests,
  getCurrentGuestActivations,
  getManagers,
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
  getClubConfig,
};
