import axios from 'axios'


function newMatch(matchdata){

    console.log(matchdata)

    return axios.post(process.env.VUE_APP_BACKEND + '/matches',matchdata)

}

function getSessionDetails(){

    return new Promise((resolve) => {
        setTimeout(function(){
            resolve({ id: 23, start: '10:30 am'})
        },2000)
    })
    
}



export default  {
    newMatch: newMatch,
    getSessionDetails: getSessionDetails
}