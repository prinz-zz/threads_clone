import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        min: 6
    },

    profilePic: {
        type: String,
        default: ''
    },

    followers: {
        type: [String],
        default: []
    },

    following: {
        type: [String],
        default: [],
    },

    bio: {
        type: String,
        default: ''
    }


},
    { timestamps: true }
)
export default mongoose.model('User', UserSchema)