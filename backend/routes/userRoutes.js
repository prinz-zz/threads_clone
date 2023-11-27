import express from 'express'
const router = express.Router()
import {
    signUp,
    login,
    logout,
    followUnFollowUser,
    updateUser,
    getUserProfile
}from '../controllers/userController.js'
import { protectedRoute } from '../middlewares/protectedRote.js'

router.get('/profile/:query', getUserProfile)
router.post('/signUp', signUp)
router.post('/login', login)
router.post('/logout', logout)
router.post('/follow/:id', protectedRoute, followUnFollowUser)
router.put('/update/:id', protectedRoute, updateUser)



export default router