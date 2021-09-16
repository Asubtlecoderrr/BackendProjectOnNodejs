const express = require('express');
// const bodyParser = require('body-parser');
// const port = process.env.port || 5000;
//const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../setup/myurl');



const router = express.Router();

router.get('/',(req,res)=>{
    res.json({test:'Auth is success'})
})

//import schema for person to register
const Person = require('../../models/person');

// @type    POST
//@route    /api/auth/register
// @desc    route for registration of users
// @access  PUBLIC

router.post("/register", (req, res) => {
    Person.findOne({ email: req.body.email })
      .then(person => {
        if (person) {
          return res
            .status(400)
            .json({ emailerror: "Email is already registered in our system" });
        } else {
          const newPerson = new Person({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          //Encrypt password using bcrypt
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPerson.password, salt, (err, hash) => {
              if (err) throw err;
              newPerson.password = hash;
              newPerson
                .save()
                .then(person => res.json(person))
                .catch(err => console.log(err));
            });
          });
        }
      })
      .catch(err => console.log(err));
  });
// @type    POST
//@route    /api/auth/login
// @desc    route for login of users
// @access  PUBLIC

router.post('/login',(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;

  Person.findOne({email})
    .then(person =>{
      if(!person){
        return res.status(404).json({NotFound : "User not found"});
      }
      bcrypt.compare(password, person.password)
      .then(isCorrect=> {
        if(isCorrect){
          //res.json({ success: "Successfully logged in"})
          //use payload and create token for user
          const payload={
            id: person.id,
            name: person.name,
            email: person.email,
          }
          jsonwt.sign(payload,key.secret,{expiresIn: '1h'}, (err,token)=>{
            if (err) throw err;
            res.json({
              success: true,
              token: "Bearer " + token,

            })
          })
        }
        else{
          res.json({error: "Password is incorrect"})
        }
        
      })
      .catch(err => console.log(err));
    })
    .catch((err)=>console.log(err));

})

// @type    POST
//@route    /api/auth/profile
// @desc    route for profile of users
// @access  PRIVATE


router.get("/profile", passport.authenticate("jwt", { session: false }),(req, res) => {
    // console.log(req);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic
    });
  }
);

module.exports = router;