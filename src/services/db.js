import axios from 'axios'


function newMatch(matchdata){

    console.log(matchdata)

    return axios.post(process.env.VUE_APP_BACKEND + '/matches',matchdata)

}



export default  {
    newMatch: newMatch
}