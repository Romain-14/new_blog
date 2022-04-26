import express from 'express';
import session from 'express-session';
import {fileURLToPath} from 'url';
import path from 'path';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import parseurl from 'parseurl';
import 'dotenv/config';

const saltrounds = 10;

const PORT = process.env.PORT || process.env.SERVER_LOCAL_PORT;
const { HOSTNAME_DB, NAME_DB, USERNAME_DB, PASSWORD_DB } = process.env;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const adminPath     = ["/admin", "/add_post", "/edit_post", "/delete_post"];
const protectedPath = ["/", "/admin", "/add_post", "/add_comment", "/edit_post", "/delete_post", "/register", "/login", "/logout", "/post"];

app.set('views', "./views");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: "super je kiffe les chats",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    }
}))

app.use((req,res, next) =>{
    const pathname = parseurl(req).pathname;
    console.log(pathname);
    res.locals.session = req.session;
        
    if(!req.session.user){
        req.session.user = null;
        req.session.isLogged = false;
    }    
    
    if (adminPath.includes(pathname) && req.session.user?.role === 'user' ) {
        res.redirect('/');
    } else if (!protectedPath.includes(pathname)){
        res.render('pageNotFound');
    } else {
        // next();
    } 
    // if (adminPath.indexOf(pathname) !== -1 && req.session.user?.role === 'user' ) {
    //     res.redirect('/');
    // } else if (protectedPath.indexOf(pathname) === -1){
    //     res.render('pageNotFound');
    // } else {
        next();
    // } 
});

/*******************/
/*******************/
// connexion à la BDD
const pool = mysql.createPool({
    connectionLimit: 10000,
    host: HOSTNAME_DB,
    database: NAME_DB,
    user: USERNAME_DB,
    password: PASSWORD_DB,
})

pool.getConnection(err=>{
    if(err){
        throw err;
    }
    console.log('Bien connecté à la BDD!');
})
/*******************/
/*******************/

app.get("/", (req,res)=>{
    console.log('home req session', req.session);
    const sql = 'SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id ORDER BY CreationTimestamp DESC';

    pool.query(sql, function(err, posts){
        res.render('layout', {template: "home", posts: posts, }
        );
    })
})

app.get('/post/:id', (req,res)=>{

    const id = req.params.id;
    console.log(id);

    const sql1 = 'SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id WHERE Post.Id = ?';
    const sql2 = 'SELECT * FROM Comment WHERE Post_Id = ?';

    pool.query(sql1, [id], function(error, post){
        pool.query(sql2, [id], function(error, comments) {
            res.render('layout', {template:'post', post: post[0], comments: comments });
        });
    });
});

app.post('/add_comment/:id', (req,res) => {
    const id = req.params.id;
    
    const sql = 'INSERT INTO Comment (NickName, Contents, CreationTimestamp, Post_Id) VALUES (?, ?, NOW(), ?)';

    pool.query(sql, [req.body.NickName, req.body.Content, id], (err)=>{
        if(err){
            throw err
        }
        res.redirect("/post/"+id);
    });
});

/*******************/
/****** ADMIN ******/
/*******************/

app.get('/admin', (req,res)=>{
    const sql = 'SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName, Category.Name AS Category_Name FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id INNER JOIN Category ON Post.Category_Id = Category.Id ORDER BY CreationTimestamp DESC';

    pool.query(sql, function(err, results){

        res.render('layout', {template:'admin/admin', results: results})
    });
});


app.get('/add_post', (req,res)=>{
    pool.query('SELECT * FROM Author ', function (err, authors){
        pool.query('SELECT * FROM Category', function (err, categories){
            res.render('layout', {template:'admin/add_post', authors: authors, categories: categories })
        });
    });
});

app.post('/add_post', (req,res)=>{
    pool.query('INSERT INTO Post (Title, Contents, Author_Id, Category_Id, CreationTimestamp) VALUES (?, ?, ?, ?, NOW())', [req.body.title, req.body.content, req.body.author, req.body.category ], function (error) {
        if(error){
            throw error
        }
        res.redirect("/admin");
    });
});

app.get('/edit_post/:id', (req,res)=>{
    const id = req.params.id;

    pool.query('SELECT * FROM Post WHERE id = ?', [id], (err, post)=>{
        res.render('layout', {template: 'admin/edit_post', post: post[0]});
    });
});

app.post('/edit_post/:id', (req,res) => {
    const id = req.params.id;

    pool.query('UPDATE Post SET Title = ?, Contents = ? WHERE Id = ?', [req.body.Title, req.body.Contents, id], (err)=>{
        if(err){
            throw err
        }
        res.redirect("/admin");
    });
});

app.get('/delete_post/:id', (req,res)=>{
    const id = req.params.id;
    console.log(id);
    pool.query('DELETE FROM post WHERE id = ?', [id], (err, result)=>{
        if(err){
            throw err
        }
        console.log(result);
        res.redirect('/admin');
    });
});

/*******************/
/****** USER *******/
/*******************/

app.get('/register', (req,res)=>{
    res.render('layout', { template: "register", session : req.session, error: null})
})

app.post('/register', async (req,res) => {
    const hash = await bcrypt.hash(req.body.password, saltrounds);
    pool.query('INSERT INTO user (Email, Password, Role, FirstName, LastName) VALUES (?,?,"user",?,?)',
    [req.body.email, hash, req.body.firstName, req.body.lastName],
     (err, result) => {
        if(err){
            throw err
        }
        console.log(result);
        res.redirect('/login');
    })
})

app.get('/login', (req,res)=>{
    res.render('layout', { template: "login", session : req.session, error: null})
})

app.post('/login', async (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;
    pool.query("SELECT * FROM user WHERE Email = ?", [email], async function (err, user){
        if(err){
            res.render("layout", {
                    template: "login",
                    error: "problème de récupération sur la bdd",                    
                });
        }        
        if(!user.length){
            res.render('layout', {template: "login", error: "user doesn't exist",})
        } else {
            const isPwValid = await bcrypt.compare(password, user[0].Password);
            if(isPwValid){
                req.session.user = {
                    firstname : user[0].FirstName,
                    role : user[0].Role,
                }
                req.session.isLogged = true;

                if(user[0].Role === "admin"){
                    res.redirect('/admin');
                } else {
                    res.redirect("/");           
                }
            } else {
                res.render("layout", {
                    template: "login",
                    error: "bad password",                    
                }) 
            }
        }        
    })
})

app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect("/");
})

app.listen(PORT, ()=>{
    console.log(`listening at http://localhost:${PORT}`);
});

