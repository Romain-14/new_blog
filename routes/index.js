import express from 'express';

import { homePage } from '../controllers/index.controller.js';
import blogRoutes from './blog.routes.js';
import entryRoutes from './entryUser.routes.js';
import adminRoutes from './admin.routes.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/', homePage);
router.use('/blog', blogRoutes);
router.use('/entryUser', entryRoutes);
router.use('/admin', isAdmin, adminRoutes);
router.get('/problem_server', (req,res,next)=>{
    res.render('problem_server');
});





export default router;