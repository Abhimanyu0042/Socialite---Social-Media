const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    avatar: {
        publicId: String,
        url: String,
    },
    followers: [ //array of object id
        {
            type: mongoose.Schema.Types.ObjectId, //rather than storing whole user we will store its object id
            ref: 'user'   //here object id refers to user 
        }
    ],
    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }]

}, {
    timestamps: true
})

module.exports = mongoose.model("user",userSchema);