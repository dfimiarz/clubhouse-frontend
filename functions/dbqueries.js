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
            members.push({ id: id, firstname: data.firstname, lastname : data.lastname, role: data.role })
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

exports.getAllSessionsForDate = function(date = null){
    
    let today_dt = new Date()
    today_dt.setHours(0)
    today_dt.setMinutes(0)
    today_dt.setSeconds(0)
    today_dt.setMilliseconds(0)

    today = today_dt.getTime()

    const date_int = date === null ? today : date

    console.log(date_int, today_dt)

    const db = admin.firestore()

    return  db.collection("/matches").where("date","==",date_int).get()
    .then((snap) => {
        sessions = []

        snap.forEach( doc => {
            const data = doc.data()
            const id = doc.id
            sessions.push({id,data})
        })

        return sessions
    })
}

exports.addMatch = function(match){

    const db = admin.firestore()

    return  db.collection("/matches").add(match)
    .then((ref) => {
        return ref
    })
}