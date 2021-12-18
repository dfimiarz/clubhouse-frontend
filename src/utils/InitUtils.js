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
        resolve({ result : user})
      }, reject)
    })
  
  }

/**
 * Check geoauth with the api server and return the value
 */
async function checkGeoAuth(){
  const result = await api.checkGeoAuth();
  return Object.prototype.hasOwnProperty.call(result.data,'geoauth') ? { result : result.data.geoauth }  : { result : null };
}

/**
 * Return values returned from checkGeoAuth and checkFireBaseLogin
 */
 function getInitStatus( geoAuthResult, firebaseResult ){

  if( geoAuthResult.status === "rejected" ) {
    return "GEOAUTH check failed"
  }

  if( firebaseResult.status === "rejected" ){
    return "Unable to check login status"
  }
  
  return true;
}

export default {
    checkFirebaseLogin,
    checkGeoAuth,
    getInitStatus
}