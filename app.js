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

app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session(mySession));
app.use(initSession);

app.use(router);
app.use('/*', pageNotFound);



/*******************/
/****** ADMIN ******/
/*******************/

// app.get('/admin', (req,res)=>{
//     const sql = 'SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName, Category.Name AS Category_Name FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id INNER JOIN Category ON Post.Category_Id = Category.Id ORDER BY CreationTimestamp DESC';

//     pool.query(sql, function(err, results){

//         res.render('layout', {template:'admin/admin', results: results})
//     });
// });


// app.get('/add_post', (req,res)=>{
//     pool.query('SELECT * FROM Author ', function (err, authors){
//         pool.query('SELECT * FROM Category', function (err, categories){
//             res.render('layout', {template:'admin/add_post', authors: authors, categories: categories })
//         });
//     });
// });

// app.post('/add_post', (req,res)=>{
//     pool.query('INSERT INTO Post (Title, Contents, Author_Id, Category_Id, CreationTimestamp) VALUES (?, ?, ?, ?, NOW())', [req.body.title, req.body.content, req.body.author, req.body.category ], function (error) {
//         if(error){
//             throw error
//         }
//         res.redirect("/admin");
//     });
// });

// app.get('/edit_post/:id', (req,res)=>{
//     const id = req.params.id;

//     pool.query('SELECT * FROM Post WHERE id = ?', [id], (err, post)=>{
//         res.render('layout', {template: 'admin/edit_post', post: post[0]});
//     });
// });

// app.post('/edit_post/:id', (req,res) => {
//     const id = req.params.id;

//     pool.query('UPDATE Post SET Title = ?, Contents = ? WHERE Id = ?', [req.body.Title, req.body.Contents, id], (err)=>{
//         if(err){
//             throw err
//         }
//         res.redirect("/admin");
//     });
// });

// app.get('/delete_post/:id', (req,res)=>{
//     const id = req.params.id;
//     console.log(id);
//     pool.query('DELETE FROM post WHERE id = ?', [id], (err, result)=>{
//         if(err){
//             throw err
//         }
//         console.log(result);
//         res.redirect('/admin');
//     });
// });

/*******************/
/****** USER *******/
/*******************/





// app.post('/login', async (req, res, next)=>{
//     const email = req.body.email;
//     const password = req.body.password;
//     pool.query("SELECT * FROM user WHERE Email = ?", [email], async function (err, user){
//         if(err){
//             res.render("layout", {
//                     template: "login",
//                     error: "problème de récupération sur la bdd",                    
//                 });
//         }        
//         if(!user.length){
//             res.render('layout', {template: "login", error: "user doesn't exist",})
//         } else {
//             const isPwValid = await bcrypt.compare(password, user[0].Password);
//             if(isPwValid){
//                 req.session.user = {
//                     firstname : user[0].FirstName,
//                     role : user[0].Role,
//                 }
//                 req.session.isLogged = true;

//                 if(user[0].Role === "admin"){
//                     res.redirect('/admin');
//                 } else {
//                     res.redirect("/");           
//                 }
//             } else {
//                 res.render("layout", {
//                     template: "login",
//                     error: "bad password",                    
//                 }) 
//             }
//         }        
//     })
// })



app.listen(PORT, ()=>{
    console.log(`listening at http://localhost:${PORT}`);
});

