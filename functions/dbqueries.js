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
    
    const day = date === null ? new Date() : new Date(date)

    day.setHours(0)
    day.setMinutes(0)
    day.setMilliseconds(0)

    const db = admin.firestore()


    return  db.collection("/matches").where("date","==",day).get()
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
    return  db.collection("/matches").add(match)
    .then((ref) => {
        return ref
    })
}