const admin = require('firebase-admin')
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true })

exports.getAllMembers = function(){
    
    const db = admin.firestore()
    let members = []

    return db.collection('/members').get()


} 