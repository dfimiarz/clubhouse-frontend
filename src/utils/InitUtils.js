import auth from '../firebase'
import api from '../services/db'

/**
 * Return a promise that subscribes to firebase's onAuthStateChange
 * gets the username and unsubscribes
 */
function checkFirebaseLogin() {

    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve({ firebaseuser: user})
      }, reject)
    })
  
  }

/**
 * Check geoauth with the api server and return the value
 */
async function checkGeoAuth(){
  const result = await api.checkGeoAuth();
  return Object.prototype.hasOwnProperty.call(result.data,'geoauth') ? result.data.geoauth  : null;
}

export default {
    checkFirebaseLogin,
    checkGeoAuth
}