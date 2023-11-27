import express from 'express'
const router = express.Router()
import {
    createPost,   
    getPost,
    deletePost,
    likeUnlike,
    replyPost,
    getFeedPosts,
    getUserPosts
} from '../controllers/postController.js'
import { protectedRoute } from '../middlewares/protectedRote.js'

router.get('/feed', protectedRoute, getFeedPosts)
router.get('/:id', getPost)
router.get('/user/:username', getUserPosts)
router.post('/create', protectedRoute, createPost)
router.delete('/delete/:id', protectedRoute, deletePost)
router.put('/like/:id', protectedRoute, likeUnlike)
router.put('/reply/:id', protectedRoute, replyPost)

export default router