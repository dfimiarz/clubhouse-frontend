'use strict';



const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true,
  });
const db = require('./dbqueries')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors);

app.post('/session', async (req,res) => {

})

app.get('/', async (req,res) => {
    res.json({name:'Clubhouse API'})
})

app.get('/members', async (req,res) => {

    try{
        let members = await db.getAllMembers()
        res.json(members)
    }
    catch( err ){ 
       
            res.status(500).json(err)
       
    }

})

app.post('/matches', async (req,res) => {

    const match = {
        bumpable: true,
        date: new Date(),
        duration: 60,
        note: "",
        start: 480,
        players: [
            { id: "test1", name: "Dan Fim", repeater: 0, repeater_lbl: "Non Repeater"},
            { id: "test2", name: "Test Fim", repeater: 0, repeater_lbl: "Non Repeater"}
        ]
    }

    try{
        let result = await db.addMatch(match)
        res.status(201)
    }
    catch( err ){
        res.status(500).json(err)
    }

})

app.get('/courts', async (req,res) => {

    try{
        let courts = await db.getCourts()
        res.json(courts)
    }
    catch( err ){
        res.status(500).json(err)
    }  
})

app.get('/sessions', async (req,res) => {

    let timemillis = isNaN(parseInt(req.query.date)) ? null :  parseInt(req.query.date) 

    try{
        let sessions = await db.getAllSessionsForDate(timemillis)
        res.json(sessions)
    }
    catch( err ){
        res.status(500).json(err)
    }  
})

/*

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
// })

// exports.signIn = functions.https.onRequest((req,res) => {

//     const username = "test"

    

// })

exports.clubhouse = functions.https.onRequest(app)