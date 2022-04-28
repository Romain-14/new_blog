import express from 'express';
import {renderPage, entry} from '../controllers/entryUser.controller.js'

const router = express.Router();

router.get(['/signin', '/signup', '/signout'], renderPage);
router.post(['/signin', '/signup'], entry);


export default router;