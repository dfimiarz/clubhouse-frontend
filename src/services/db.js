import axios from 'axios'


function newMatch(matchdata){

    console.log(matchdata)

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
                            "end_time": new Date().getTime(),
                            "hash" : params.hash
                         }
                }
            
        } 
    )      
}



export default  {
    newMatch: newMatch,
    getSessionDetails: getSessionDetails,
    endSession: endSession
}