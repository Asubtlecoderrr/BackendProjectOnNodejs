const mongoose = require('mongoose');
const schema = mongoose.Schema;

const QuestionSchema =  new schema({
    user: {
        type: schema.Types.ObjectId,
        ref : 'myPerson'
    },
    name:{
        type: String,
        
    },
    text:{
        type: String,
        required: true,
        max : 100
    },
    code:{
        type: String,
        required: true,
    },
    upvote:[
        {
            user: {
                type: schema.Types.ObjectId,
                ref: "myPerson"
              }
        }
    ],
    answers :[
        {
            user: {
                type: schema.Types.ObjectId,
                ref: "myPerson"
              },
              text: {
                type: String,
                required: true
              },
              name: {
                type: String
              },
              date: {
                type: Date,
                default: Date.now
              }
        }
    ],
    date: {
        type: Date,
        default: Date.now
      }
})

module.exports = Question = mongoose.model('myQuestion',QuestionSchema)