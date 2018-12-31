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
            freefor: 1 * 3600 * 1000,
            freein:0,
            bookable: true,
            msg:[]
            
        },
        {
            label:"#2",
            id:2,
            state:1,
            statelbl:"OPEN",
            status:{label:"Available",caption:"Free for 2 hours"},
            freefor: 2 * 3600 * 1000,
            freein:0,
            bookable: true,
            msg:["12/15/18 8 am - Doubles only on this court today"]
        },
        {
            label:"#3",
            id:3,
            state:1,
            statelbl:"OPEN",
            status:{label:"Available",caption:"Free for 3 hours"},
            freefor: 3 * 3600 * 1000,
            freein:0,
            bookable: true,
            msg:[]
            
        },
        {
            label:"#4",
            id:4,
            state:1,
            statelbl:"OPEN",
            status:{label:"Occupied",caption:"Busy for 1 hour. Bumpable in 20 min"},
            freefor: 0,
            freein: 1 * 3600 * 1000,
            bookable: false,
            msg:[]
        },
        {
            label:"#5",
            id:5,
            state:0,
            statelbl:"CLOSED",
            status:{label:"Unavailable",caption:"Cannot be booked"},
            freefor:0,
            freein:0,
            bookable: false,
            msg:["12/15/18 8 am - Maintenance. Should be able to reopen at 12pm"],
            
        }
    ];

    return cors(req,res, () => {
            res.json(courts);
        }
    );
})
