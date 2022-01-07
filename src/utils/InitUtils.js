import {  onAuthStateChanged } from "firebase/auth";
import auth from '../firebase'
import api from '../services/db'

/**
 * Return a promise that subscribes to firebase's onAuthStateChange
 * gets the username and unsubscribes
 */
function getUser() {

    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth,(user) => {
        unsubscribe();
        if( user ){
          resolve({result: user.email})
        }
        else {
          resolve({result: null} )
        }
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
 function getInitStatus( geoAuthResult, appDataResult ){

  if( geoAuthResult.status === "rejected" ) {
    return "Geoauth check failed"
  }

  if( appDataResult.status === "rejected" ){
    return "User auth check failed"
  }
  
  return true;
}

export default {
    getUser,
    checkGeoAuth,
    getInitStatus
}