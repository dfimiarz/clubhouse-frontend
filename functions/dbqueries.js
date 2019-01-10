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