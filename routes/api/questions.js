const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person Model
const Person = require("../../models/person");

//Load Profile Model
const Profile = require("../../models/profile");

//Load Question Model
const Question = require("../../models/questions");

// @type    GET
//@route    /api/questions/
// @desc    route for showing all questions
// @access  PUBLIC
router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then(questions => res.json(questions))
    .catch(err => res.json({ noquestions: "NO questions to display" }));
});
// @type    POST
//@route    /api/questions/
// @desc    route for submiting questions
// @access  Private

router.post('/',passport.authenticate('jwt',{session: false}),(req,res)=>{
    const newQ = new Question({
        user: req.user.id,
        name: req.body.name,
        text: req.body.text,
        code: req.body.code,
        
    })
    newQ.save()
    .then(question=> res.json(question))
    .catch(err=> console.log("Unable to upload the question"))
})

// @type    GET
//@route    /api/questions/everyquest
// @desc    route for fetching ALL THE questions
// @access  Public
router.get('/everyquest',(req,res)=>{
    Question.find({})
    .sort('-date')
    .then(question=>res.json(question))
    .catch(err => console.log("Error in fetching all the questions"+err))
})

// @type    GET
//@route    /api/questions/everyquest/:id
// @desc    route for fetching ALL THE questions of one user
// @access  Public
router.get('/everyquest/:id',(req,res)=>{
    Question.find({user: req.params.id})
    .sort('-date')
    .then(question=>res.json(question))
    .catch(err => console.log("Error in fetching all the questions"+err))
})

// @type    DELETE
//@route    /api/questions/:id
// @desc    route for DELETING questions
// @access  PRIVATE
router.delete('/:id',passport.authenticate('jwt',{session: false}),(req,res)=>{
    Question.findOne({ user: req.user.id })
      .then(question=>{
          Question.findOneAndRemove({_id : req.params.id})
          .then(success=> res.json({success : "Successfully deleted"}))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err));
})

// @type    DELETE
//@route    /api/questions/
// @desc    route for DELETING all questions of that user
// @access  PRIVATE
router.delete('/',passport.authenticate('jwt',{session: false}),(req,res)=>{
    Question.findOne({ user: req.user.id })
      .then(question=>{
          Question.deleteMany({user: req.user.id})
          .then(success=> res.json({success : "Successfully deleted ALL"}))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err));
})


// @type    POST
//@route    /api/questions/answer/:id
// @desc    route for posting answers to questions
// @access  PRIVATE
router.post('/answer/:id',passport.authenticate('jwt',{session: false}),(req,res)=>{

    Question.findById(req.params.id)
    .then(question=>{
        const newAnswer = {
            user: req.user.id,
            text: req.body.text,
            name: req.body.name,
        }
        question.answers.push(newAnswer)
        question
          .save()
          .then(question => res.json(question))
          .catch(err => console.log(err));

    })
    .catch()
})

// @type    GET
//@route    /api/questions/answer/:id
// @desc    route for fetching all answers to one question
// @access  PUBLIC
router.get('/answer/:id',(req,res)=>{
    Question.findById(req.params.id)
    .then(question=>res.json(question.answers))
    .catch(err => console.log("Error in fetching all the questions"+err))
})

// @type    DELETE
//@route    /api/questions/answer/:q_id/:id
// @desc    route for deleting answers to questions
// @access  PRIVATE

router.delete('/answer/:q_id/:id',passport.authenticate('jwt',{session: false}),(req,res)=>{
    Question.find({ user: req.user.id })
    Question.findById({_id:req.params.q_id})
      .then(question => {
        const removethis = question.answers
        .map(item => item.id)
        .indexOf(req.params.id);

      question.answers.splice(removethis, 1);

      question
        .save()
        .then(answer => res.json({success: "Successfully deleted"}))
        .catch(err => console.log(err));

      })
      .catch(err => console.log(err));
})


// @type    POST
//@route    /api/questions/upvote/:id
// @desc    route for for upvoting
// @access  PRIVATE
router.post(
    "/upvote/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          Question.findById(req.params.id)
            .then(question => {
              if (question.upvote.filter(upvote => upvote.user.toString() === req.user.id.toString()).length > 0) {
                  //question.upvote.findOneAndRemove({user :req.user.id}).then(upvote=>res.json({ downvote: "User downvoted successfully" })).catch(err => console.log(err))
                  const removethis = question.upvote
                    .map(item => item.user)
                    .indexOf(req.user.id);

                  question.upvote.splice(removethis, 1);

                  question
                    .save()
                    .then(question => res.json({downvote: "User downvoted successfully"}))
                    .catch(err => console.log(err));
              }else{
              question.upvote.unshift({ user: req.user.id });
              question
                .save()
                .then(question => res.json(question))
                .catch(err => console.log(err));
              }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  );
module.exports = router;