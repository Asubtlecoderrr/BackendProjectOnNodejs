const mongoose = require('mongoose');
const schema = mongoose.Schema;

const PersonSchema = new schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    profilepic: {
        type: String,
        default: "https://www.clipartmax.com/png/middle/91-915439_to-the-functionality-and-user-experience-of-our-site-red-person-icon.png"
    },
    date: {
        type: Date,
        default: Date.now
    }

});

// mongoose.connect(db)
//     .then(()=> console.log('Connected successfully'))
//     .catch((error) => console.log(error));

Person = mongoose.model("myPerson",PersonSchema);
module.exports = Person;
