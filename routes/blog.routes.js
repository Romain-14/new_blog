import express from 'express';
import { blogPage, onePostPage, addComment } from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/', blogPage); // /blog
router.get('/:id', onePostPage); // /blog/:id
router.post('/add_comment/:id', addComment); // /blog/add_comment/:id

export default router