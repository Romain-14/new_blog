import express from 'express';
import {getController, postController} from '../controllers/entryUser.controller.js'

const router = express.Router();

router.get(['/signin', '/signup', '/signout'], getController);
router.post(['/signin', '/signup'], postController);


export default router;