import axios from 'axios'


function newMatch(matchdata){

    return axios.post(process.env.VUE_APP_FUNCTION_ENDPOINT + '/matches',matchdata)

}



export default  {
    newMatch: newMatch
}