import axios from 'axios'


function newMatch(matchdata){

    //console.log(matchdata)

    return axios.post(process.env.VUE_APP_BACKEND + '/matches',matchdata)

}

function getSessionDetails( id ){

    return axios.get(process.env.VUE_APP_BACKEND + '/matches/' + id)
    
}

function endSession(params){
    
    return axios.patch( process.env.VUE_APP_BACKEND + `/matches/${params.id}`, 
        { 
            "cmd" : {
                "name":"END_SESSION",
                "params" : { 
                            "hash" : params.hash
                         }
                }
            
        } 
    )      
}

function removeSession(params){

    return axios.patch( process.env.VUE_APP_BACKEND + `/matches/${params.id}`, 
        { 
            "cmd" : {
                "name":"REMOVE_SESSION",
                "params" : { 
                            "hash" : params.hash
                         }
                }
            
        } 
    )      
}

function changeSessionTime(params){
    return axios.patch( process.env.VUE_APP_BACKEND + `/matches/${params.id}`,
        { 
            "cmd" : {
                "name":"CHANGE_TIME",
                "params" : { 
                            "hash" : params.hash,
                            "start": params.start,
                            "end": params.end
                        }
                }
            
        } 
     )
}
function changeCourt(params){
    return axios.patch( process.env.VUE_APP_BACKEND + `/matches/${params.id}`,
        { 
            "cmd" : {
                "name":"CHANGE_COURT",
                "params" : { 
                            "hash" : params.hash,
                            "court": params.court
                        }
                }
            
        } 
     )
}

function getCourts(){
    return axios.get(process.env.VUE_APP_BACKEND + '/courts')
}

function getMembers(){
    return axios.get(process.env.VUE_APP_BACKEND + '/members')
}

export default  {
    newMatch: newMatch,
    getSessionDetails: getSessionDetails,
    endSession: endSession,
    removeSession: removeSession,
    changeTime: changeSessionTime,
    changeCourt,
    getCourts,
    getMembers
}