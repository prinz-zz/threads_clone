
import User from '../models/User.js'
import Post from '../models/Post.js'
import errorHandler from 'express-async-handler'
import { v2 as cloudinary } from 'cloudinary'


//get post
const getPost = errorHandler(async (req, res) => {

    const post = await Post.findById(req.params.id)

    if (!post) {
        return res.status(404).json({ error: 'No post found' })
        //throw new Error('No post found')
    }

    res.status(200).json(post)

})


//create post
const createPost = errorHandler(async (req, res) => {

    const { postedBy, text } = req.body 
    let { img } = req.body

    if (!postedBy || !text) {
        return res.status(400).json({ error: 'Postedby and text fields are required' })
        //throw new Error('Postedby and text fields are required')
    }

    const user = await User.findById(postedBy)
    if (!user) {
        return res.status(404).json({ error: 'User not found' }) 
        //throw new Error('User not found')
    }


    if (user._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ error: 'You are not authorised' })
        //throw new Error('You are not authorised')
    }


    const maxlength = 500
    if (text.length > maxlength) {
        return res.status(400).json({ error: `Text must be less than ${maxlength} characters` })
        //throw new Error(`Text must be less than ${maxlength} characters`)
    }

    if (img) {
        const uploadImage = await cloudinary.uploader.upload(img)
        img = uploadImage.secure_url
    }

    const newPost = new Post({ postedBy, text, img })
    await newPost.save()

    res.status(201).json(newPost)

})

//delete Post

const deletePost = errorHandler(async (req, res) => {

    const post = await Post.findById(req.params.id)

    if (!post) {
        return res.status(404).json({ error: 'No post found' })
        //throw new Error('No post found')
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ error: 'You are not authorised' })
        //throw new Error('Unauthorized')
    }
    if (post.img) {
        const imgId = post.img.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(imgId)
    }

    await Post.findByIdAndDelete(req.params.id)


    res.status(200).json({ message: 'Post successfully deleted' })
})


//like/unlike post

const likeUnlike = errorHandler(async (req, res) => {

    const postId = req.params.id
    const userId = req.user._id.toString()


    const post = await Post.findById(postId)

    if (!post) {
        return res.status(404).json({ error: 'No post found' })
        //throw new Error('No post found')
    }

    const userLikedPost = post.likes.includes(userId)

    if (userLikedPost) {
        //unlike post
        await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
        res.status(200).json({ message: 'post unliked succesfully' })

    } else {
        //like post
        post.likes.push(userId)
        await post.save()
        res.status(200).json({ message: 'post liked succesfully' })
    }
})


//Reply post
const replyPost = errorHandler(async (req, res) => {

    const { text } = req.body
    const postId = req.params.id
    const userId = req.user._id
    const userProfilePic = req.user.profilePic
    const username = req.user.username

    if (!text) {
        return res.status(400).json({ error: 'Text field is required' })
        //throw new Error('Text field is required')
    }

    const post = await Post.findById(postId)

    if (!post) {
        return res.status(404).json({ error: 'No post found' })
        //throw new Error('No post found')
    }

    const reply = { userId, text, userProfilePic, username }

    post.replies.push(reply)
    await post.save()

    res.status(200).json(post)

})


//get feed post

const getFeedPosts = errorHandler(async (req, res) => {

    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ error: 'User not found' })
        //throw new Error('User not found')
    }

    const following = user.following

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

    res.status(200).json(feedPosts)

})


//get user
const getUserPosts = async (req, res) => {

    const { username } = req.params

    try {

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
            //throw new Error('User not found')
        }

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 })
        res.status(200).json(posts)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

export {
    createPost,
    getPost,
    deletePost,
    likeUnlike,
    replyPost,
    getFeedPosts,
    getUserPosts
}
