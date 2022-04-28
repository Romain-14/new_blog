import express from 'express';
import session from 'express-session';
import {fileURLToPath} from 'url';
import path from 'path';
import "dotenv/config";

import {PORT} from './config/index.js';
import {mySession} from './config/session.js';
import initSession from './config/session.js';

import router from './routes/index.js';
import { pageNotFound } from './controllers/index.controller.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.set('views', "./views");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname + "/public"),{extensions: ["js"]}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session(mySession));
app.use(initSession);

app.use(router);
app.use('/*', pageNotFound);

app.listen(PORT, ()=>{
    console.log(`listening at http://localhost:${PORT}`);
});

