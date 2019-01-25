const admin = require('firebase-admin')
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true })

exports.getAllMembers = function(){
    
    const db = admin.firestore()

    return db.collection('/members').get()
    .then((snap) => {
        
        members = []
         
        snap.forEach( doc => {
            const data = doc.data()
            const id = doc.id
            members.push({ id: id, name: data.firstname + " " + data.lastname, role: data.role })
        })

        return members
    })

} 

exports.getAllSessionsForDate = function(date){
    const reqdate = new Date(date)

    const datestr = String(reqdate.getFullYear() + pad(reqdate.getMonth()+1) + pad(reqdate.getDate())) 

    const db = admin.firestore()

    return db.collection('/schedule/' + datestr + '/matches').get()
    .then((snap) => {
        sessions = []

        snap.forEach( doc => {
            const data = doc.data()
            const id = doc.id
            sessions.push(id)
        })

        return sessions
    })
}

function pad(number){
    if (number < 10) {
        return '0' + number;
      }
      return number;
}