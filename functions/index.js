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
        {"label":"#1","id":1,"state":1,"msg":"","busyat":now_ms + 2 * 60 * 1000,"freeat":0},
        {"label":"#2","id":2,"state":1,"msg":"","busyat":now_ms + 60 * 1000,"freeat":0},
        {"label":"#3","id":3,"state":1,"msg":"","busyat":now_ms + 10 * 1000,"freeat":0},
        {"label":"#4","id":4,"state":1,"msg":"","busyat":0,"freeat":now_ms + 10 * 1000},
        {"label":"#5","id":5,"state":1,"msg":"","busyat":0,"freeat":now_ms + 30 * 1000}
    ];

    return cors(req,res, () => {
            res.json(courts);
        }
    );
})
