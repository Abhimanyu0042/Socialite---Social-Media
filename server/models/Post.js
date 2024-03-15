const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'  //we will be able to access users quite easily by adding this line
    },
    image: {
        publicId: String,
        url: String
    },
    caption: {
        type: String,
        required: true
    },
    likes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("post", postSchema);