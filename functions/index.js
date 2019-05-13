const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true,
  });
  
const db = require('./dbqueries')

exports.getMembers = functions.https.onRequest((req,res) => { 
    
    db.getAllMembers().then( (members) => {
        return cors(req,res, () => {
            res.json(members)
        })
    })
    .catch( err => { 
        return cors(req,res, () => {
            res.status(500).json(err)
        })
    })

})

exports.getSessions = functions.https.onRequest((req,res) => { 

    db.getAllSessionsForDate(parseInt(req.query.date)).then( (sessions) => {
        return cors(req,res, () => {
            res.json(sessions)
        })
    })
    .catch( err => { 
        return cors(req,res, () => {
            res.status(500).json(err)
        })
    })

})

exports.getCourts = functions.https.onRequest((req,res) => {

        db.getCourts().then( courts => {
            return cors(req,res, () => {
                res.json(courts)
            })
        })
        .catch( err => { 
            return cors(req,res, () => {
                res.status(500).json(err)
            })
        })
})


exports.getCourtStatus = functions.https.onRequest((req,res) => {

    Promise.all([db.getCourts(),db.getAllSessionsForDate(1548306000000)]).then((vals) => {

        return cors(req,res, () => {
            res.json(vals)
        })

    }).catch(() => {
        return cors(req,res, () => {
            res.json(courts)
        })
    })


        


    
    /*
    var today = new Date()
    now_ms = today.getTime() + (today.getTimezoneOffset() * 60000)
    today.setHours(0,0,0,0)
    t_md_ms = today.getTime() +  (today.getTimezoneOffset() * 60000)

    let fakeStartTime = new Date('January 1, 2019 7:00:00')
    let fakeEndTime = new Date('January 1, 2019 9:00:00')

    let fakeStartTimeMs = fakeStartTime.getTime() + (fakeStartTime.getTimezoneOffset() * 60000)
    let fakeEndTimeMs = fakeEndTime.getTime() + (fakeEndTime.getTimezoneOffset() * 60000)

    console.log( fakeStartTime.toLocaleString() )

    const courts = [
        {
            label:"#1",
            id:1,
            state:1,
            statelbl:"OPEN",
            status:{label:"Available",caption:"Free for 1 hour"},
            startat: fakeStartTimeMs,
            endat: fakeStartTimeMs + 1 * 3600 * 1000,
            serverTime: now_ms,
            bookable: true,
            msg:[]
            
        },
        {
            label:"#2",
            id:2,
            state:1,
            statelbl:"OPEN",
            status:{label:"Available",caption:"Free for 2 hours"},
            startat: fakeStartTimeMs,
            endat: fakeStartTimeMs + 2 * 3600 * 1000,
            serverTime: now_ms,
            bookable: true,
            msg:["12/15/18 8 am - Doubles only on this court today"]
        },
        {
            label:"#3",
            id:3,
            state:1,
            statelbl:"OPEN",
            status:{label:"Available",caption:"Free for 3 hours"},
            startat: fakeStartTimeMs,
            endat: fakeStartTimeMs + 3 * 3600 * 1000,
            serverTime: now_ms,
            bookable: true,
            msg:[]
            
        },
        {
            label:"#4",
            id:4,
            state:1,
            statelbl:"OPEN",
            status:{label:"Occupied",caption:"Busy for 1 hour. Bumpable in 20 min"},
            startat: fakeEndTimeMs,
            endat: fakeEndTimeMs + 1 * 3600 * 1000,
            serverTime: now_ms,
            bookable: true,
            msg:[]
        },
        {
            label:"#5",
            id:5,
            state:0,
            statelbl:"CLOSED",
            status:{label:"Unavailable",caption:"Cannot be booked"},
            startat: now_ms,
            endat: now_ms,
            serverTime: now_ms,
            bookable: false,
            msg:["12/15/18 8 am - Maintenance. Should be able to reopen at 12pm"],
            
        }
    ];

    return cors(req,res, () => {
            res.json(courts);
        }
    );
    */
})

exports.signIn = functions.https.onRequest((req,res) => {

    const username = "test"

    

})
