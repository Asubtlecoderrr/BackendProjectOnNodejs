const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.port || 5000;
const mongoose = require('mongoose');
const passport = require('passport');

const auth = require('./routes/api/auth');

const profile = require('./routes/api/profile');

const quest = require('./routes/api/questions');


const app = express();

//middleware for bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const db = require('./setup/myurl').mongoURL

mongoose.connect(db)
    .then(()=> console.log('Connected successfully'))
    .catch((error) => console.log(error));

//Passport middleware
app.use(passport.initialize());

//congig for jwt strategy
require("./strategies/jsonwt")(passport);

//testing purpose
app.get('/',(req,res)=>{
    res.send("Hey there")
});

//actual routes
app.use('/api/auth',auth);

app.use('/api/profile',profile);

app.use('/api/questions',quest);

app.listen(port,()=>{
    console.log(`App is running at port ${port}`)
});