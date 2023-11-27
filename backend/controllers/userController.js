
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Post from '../models/Post.js'
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'
import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose'



//get User Profile  
const getUserProfile = asyncHandler(async (req, res) => {
    //either username or userId
    const { query } = req.params

    let user

    //query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
        user = await User.findOne({ _id: query }).select('-password').select('-updatedAt')
        //query is username    
    } else {
        user = await User.findOne({ username: query }).select('-password').select('-updatedAt')
    }

    //const user = await User.findOne({ username }).select('-password').select('-updatedAt')
    if (!user) {
        return res.status(404).json('User not found')
        //throw new Error('User not found')
    }
    res.status(200).json(user)

})


//signUp user
const signUp = asyncHandler(async (req, res) => {

    const { name, email, username, password } = req.body;

    const isEmpty = Object.values(req.body).some((value) => value === '');

    if (isEmpty) {
        return res.status(400).json({ error: 'All fields are required' })
        //throw new Error('All fields are required')
    }

    //userExists
    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' })
        //throw new Error('User already exists')
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        ...req.body,
        password: hashedPassword
    })

    if (user) {
        generateTokenAndSetCookie(user._id, res)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        })
    } else {
        return res.status(400).json({ error: 'invalid user data' })
        //throw new Error("invalid user data")
    }

})



//Login user
const login = asyncHandler(async (req, res) => {

    const { username, password } = req.body

    const isEmpty = Object.values(req.body).some((value) => value = '')
    if (isEmpty) {
        return res.status(400).json({ error: 'All fields are required' })
        //throw new Error('All fields are required')
    }

    //match username
    const user = await User.findOne({ username })

    //MATCH PASSWORD
    const isMatch = await bcrypt.compare(password, user?.password || '')


    if (!user || !isMatch) {
        return res.status(400).json({ error: "Invalid username or password" });
        //throw new Error('Invalid username or password')
    }

    generateTokenAndSetCookie(user._id, res)

    res.status(200).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
    })

})


//Logout user

const logout = (req, res) => {
    res.cookie(
        "jwt", '',
        {
            maxAge: new Date(0)
        }
    )
    res.status(200).json('Logged out, successful')
}


//follow and unfollow user
const followUnFollowUser = asyncHandler(async (req, res) => {

    const { id } = req.params

    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)


    if (id === req.user._id.toString()) {
        return res.status(400).json({ error: 'You cannot follow/unfollow yourself' })
        //throw new Error('You cannot follow/unfollow yourself')
    }

    if (!userToModify || !currentUser) {
        return res.status(404).json({ error: 'User not found!' })
        //throw new Error('User not found!')
    }

    const isFollowing = currentUser.following.includes(id)

    if (isFollowing) {
        //unfollow user
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
        await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
        res.status(200).json({ success: "User unfollowed successfully" })
    } else {
        //follow user
        await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
        await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
        res.status(200).json({ message: "User followed successfully" })
    }

})

//update User 
const updateUser = asyncHandler(async (req, res) => {

    const { name, username, email, password, bio } = req.body
    let { profilePic } = req.body
    const userId = req.user._id

    let user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
        //throw new Error('User not found')
    }
    if (req.params.id !== userId.toString()) {
        return res.status(401).json({ error: 'You are not allowed to update this user' })
        //throw new Error('You are not allowed to update this user')
    }
    console.log(req.params.id);

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
    }

    if (profilePic) {
        if (user.profilePic) {
            await cloudinary.uploader.destroy(user.profilePic.split('/').pop().split('.')[0]);

        }

        const uploadImage = await cloudinary.uploader.upload(profilePic)

        profilePic = uploadImage.secure_url
    }

    user.name = name || user.name // name (if the value is null)
    user.username = username || user.username
    user.email = email || user.email
    user.profilePic = profilePic || user.profilePic
    user.bio = bio || user.bio

    user = await user.save()

    //find all posts and update these fields
    await Post.updateMany(
        { "replies.userId": userId },
        {
            $set: {
                "replies.$[reply].username": user.username,
                "replies.$[reply].profilePic": user.profilePic,
            }
        },
        { arrayFilters: [{ "reply.userId": userId }] }
    )

    user.password = null

    res.status(200).json(user)

})




export {
    signUp,
    login,
    logout,
    followUnFollowUser,
    updateUser,
    getUserProfile
}