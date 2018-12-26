const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true,
  });

exports.getCourts = functions.https.onRequest((req,res) => {
    
    var today = new Date()
    now_ms = today.getTime()
    today.setHours(0,0,0,0);
    t_md_ms = today.getTime()

    const courts = [
        {
            label:"#1",
            id:1,
            state:1,
            statelbl:"OPEN",
            status:{label:"Available",caption:"Free for 1 hour"},
            maxtime: 60 * 1000,
            bookable: true,
            msg:[],
            busyat:now_ms + 2 * 60 * 1000,
            freeat:0
        },
        {
            label:"#2",
            id:2,
            state:1,
            statelbl:"OPEN",
            status:{label:"Available",caption:"Free for 1 hour"},
            maxtime: 60 * 1000,
            bookable: true,
            msg:["12/15/18 8 am - Doubles only on this court today"],
            busyat:now_ms + 60 * 1000,
            freeat:0
        },
        {
            label:"#3",
            id:3,
            state:1,
            statelbl:"OPEN",
            status:{label:"Available",caption:"Free for 1 hour"},
            maxtime: 60 * 1000,
            bookable: true,
            msg:[],
            busyat:now_ms + 10 * 1000,
            freeat:0
        },
        {
            label:"#4",
            id:4,
            state:1,
            statelbl:"OPEN",
            status:{label:"Occupied",caption:"Busy for 1 hour. Bumpable in 20 min"},
            maxtime: 0,
            bookable: false,
            msg:[],
            busyat:0,
            freeat:now_ms + 10 * 1000
        },
        {
            label:"#5",
            id:5,
            state:0,
            statelbl:"CLOSED",
            status:{label:"Unavailable",caption:"Cannot be booked"},
            maxtime: 0,
            bookable: false,
            msg:["12/15/18 8 am - Maintenance. Should be able to reopen at 12pm"],
            busyat:0,
            freeat:0
        }
    ];

    return cors(req,res, () => {
            res.json(courts);
        }
    );
})
