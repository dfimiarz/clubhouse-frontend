const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true,
  });

exports.getCourts = functions.https.onRequest((req,res) => {
    
    const courts = [
        {"label":"#1","id":1,"state":1,"msg":"","freefor":60,"occfor":0},
        {"label":"#2","id":2,"state":1,"msg":"","freefor":60,"occfor":0},
        {"label":"#3","id":3,"state":1,"msg":"","freefor":60,"occfor":0},
        {"label":"#4","id":4,"state":1,"msg":"","freefor":60,"occfor":0},
        {"label":"#5","id":5,"state":1,"msg":"","freefor":60,"occfor":0}
    ];

    return cors(req,res, () => {
            res.json(courts);
        }
    );
})
