import express from 'express';
import {
    adminPage,
    addPostPage,
    postsListPage,
    commentsListPage,
    usersListPage,
    editPostPage,
    addPost,
    editPost,
    deletePost
} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/', adminPage );

router.get('/add_post', addPostPage );
router.post('/add_post', addPost );

router.get('/posts_list', postsListPage );

router.get('/comments_list', commentsListPage );

router.get('/users_list', usersListPage );

router.get('/edit_post/:id', editPostPage );
router.post('/edit_post/:id', editPost );

router.get('/delete_post/:id', deletePost );

export default router