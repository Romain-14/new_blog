import express from 'express';

import { homePage } from '../controllers/index.controller.js';
import blogRoute from './blog.routes.js';
import entryRoute from './entryUser.routes.js';

const router = express.Router();

router.get('/', homePage);
router.use('/blog', blogRoute);
router.use('/entryUser', entryRoute);
router.get('/problem_server', (req,res,next)=>{
    res.render('problem_server');
});





export default router;