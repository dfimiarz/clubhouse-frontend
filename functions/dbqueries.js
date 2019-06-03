const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

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

exports.getCourts = async function(){

    let courts = [];

    
    const db = admin.firestore()
    
    const snap = await db.collection('/courts').get();
    
    
    snap.forEach(doc => {
        const data = doc.data();
        const id = doc.id;
        courts.push({ id: id, lbl: data.lbl, msg: data.msg, state: data.state, statelbl: data.statelbl });
    });
    

    return courts;

}

exports.getAllSessionsForDate = function(date){
    const reqdate = new Date(date)

    const datestr = String(reqdate.getFullYear() + pad(reqdate.getMonth()+1) + pad(reqdate.getDate())) 

    const db = admin.firestore()

    console.log('/schedule/' + datestr + '/matches')

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

exports.auth = function(){
    // TO DO. Write auth function
}

function pad(number){
    if (number < 10) {
        return '0' + number;
      }
      return number;
}