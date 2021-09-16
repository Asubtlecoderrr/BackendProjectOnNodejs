const mongoose = require('mongoose');
const schema = mongoose.Schema;

const profileSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref : 'myPerson'
    },
    username:{
        type: String,
        required: true,
        max:20
    },
    website: {
        type: String
      },
      country: {
        type: String
      },
      languages: {
        type: [String],
        required: true
      },
      portfolio: {
        type: String
      },
      workrole: [
        {
          role: {
            type: String,
            required: true
          },
          company: {
            type: String
          },
          country: {
            type: String
          },
          from: {
            type: Date
          },
          to: {
            type: Date
          },
          current: {
            type: Boolean,
            default: false
          },
          details: {
            type: String
          }
        }
      ],
      social: {
        youtube: {
          type: String
        },
        facebook: {
          type: String
        },
        instagram: {
          type: String
        }
      },
      date: {
        type: Date,
        default: Date.now
      }
});

module.exports = Profile = mongoose.model("myProfile", profileSchema);
