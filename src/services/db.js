import axios from 'axios'
import auth from '../firebase'

const instance = axios.create({
    baseURL: process.env.VUE_APP_BACKEND
})

instance.interceptors.request.use(async config => {

    if (auth.currentUser) {

        try {
            const idtoken = await auth.currentUser.getIdToken();
            config.headers.authorization = `Bearer ${idtoken}`;
            return config;
        }
        catch (err) {
            throw new Error("Unable to retrieve user token")
        }

    }
    else {
        return config;
    }
},
    (err) => {
        return Promise.reject(err)
    });

function newMatch(matchdata) {

    //console.log(matchdata)

    return axios.post(process.env.VUE_APP_BACKEND + '/bookings', matchdata)

}

function getBookingDetails(id) {

    return axios.get(process.env.VUE_APP_BACKEND + '/bookings/' + id)

}

function endSession(params) {

    return axios.patch(process.env.VUE_APP_BACKEND + `/bookings/${params.id}`,
        {
            "cmd": {
                "name": "END_SESSION",
                "params": {
                    "hash": params.hash
                }
            }

        }
    )
}

function removeSession(params) {

    return axios.patch(process.env.VUE_APP_BACKEND + `/bookings/${params.id}`,
        {
            "cmd": {
                "name": "REMOVE_SESSION",
                "params": {
                    "hash": params.hash
                }
            }

        }
    )
}

function changeSessionTime(params) {
    return axios.patch(process.env.VUE_APP_BACKEND + `/bookings/${params.id}`,
        {
            "cmd": {
                "name": "CHANGE_TIME",
                "params": {
                    "hash": params.hash,
                    "start": params.start,
                    "end": params.end
                }
            }

        }
    )
}
function changeCourt(params) {
    return axios.patch(process.env.VUE_APP_BACKEND + `/bookings/${params.id}`,
        {
            "cmd": {
                "name": "CHANGE_COURT",
                "params": {
                    "hash": params.hash,
                    "court": params.court
                }
            }

        }
    )
}

function getCourts() {
    return instance.get('/courts')
}

function getMembers() {
    return axios.get(process.env.VUE_APP_BACKEND + '/persons/members')
}

function getGuests() {
    return axios.get(process.env.VUE_APP_BACKEND + '/persons/guests')
}

async function addGuest(guest) {

    return await axios.post(process.env.VUE_APP_BACKEND + '/persons/guests', guest)
}

async function getEligiblePersons() {
    return instance.get(process.env.VUE_APP_BACKEND + '/persons/eligible')
}

async function getInactiveGuests() {
    return axios.get(process.env.VUE_APP_BACKEND + '/persons/guests/inactive')
}

async function getCurrentGuestActivations() {
    return axios.get(process.env.VUE_APP_BACKEND + '/guest_activations/current')
}

/**
 *  Get Booking Types
 */
async function getBookingTypes() {
    return axios.get(process.env.VUE_APP_BACKEND + '/booking_types')
}

/**
 * Get club managers
 */
async function getManagers() {
    return axios.get(process.env.VUE_APP_BACKEND + '/persons/members/managers')
}

/**
 * 
 * @param {Number} memberhost_id ID of the active member host
 * @param {Number[]} guests Array of IDs for inactive guets
 */
async function activateGuests(memberhost_id, guests) {
    return axios.post(process.env.VUE_APP_BACKEND + '/guest_activations/bulk', { memberhost: memberhost_id, "guests": guests })
}

async function checkGeoAuth() {

    return axios.get(process.env.VUE_APP_BACKEND + '/auth/geo');
}

// eslint-disable-next-line no-unused-vars
async function getRecaptchaScore(token) {
    //Build a rest URL and add recaptcha token
    let url = new URL(process.env.VUE_APP_BACKEND + '/auth/recaptchascore');

    url.searchParams.set('token', token);

    const result = await axios.get(url);

    return result.data;
}
export default {
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
    getRecaptchaScore
}