import bcrypt from 'bcrypt';
import { saltrounds } from '../config/index.js';
import User from '../models/entryUser.model.js';

export const getController = (req,res,next)=>{
    
    if(req.url === '/signin'){
        res.render('layout', {template: "entryUser", type:"signin"});
    }
    if(req.url === '/signup'){
        res.render('layout', {template: "entryUser", type:"signup"});
    }
    if(req.url === '/signout'){
        req.session.destroy();
        res.redirect("/")
    }
}

export const postController = async (req,res,next)=>{

    if(req.url === '/signin'){
        const datas = {
            q: 'SELECT * FROM user WHERE Email = ?',
            value : req.body.email,
            password : req.body.password,
        }
        try {
            const user = await User.getUserByField(datas);          
            if(!user.length){
                res.render('layout', {template: "entryUser",type:"signin", error: "user doesn't exist",})
            } else {
                const isPwValid = await bcrypt.compare(datas.password, user[0].Password);
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
                        template: "entryUser",
                        type:"signin",
                        error: "bad password",                    
                    }) 
                }
            }         
        } catch (error) {
            res.redirect('/problem_server');
        }
    }
    
    if(req.url === '/signup'){
        try {
            const hash = await bcrypt.hash(req.body.password, saltrounds);
            const datas = {
                email : req.body.email,
                password : hash,
                role : "user",
                firstname : req.body.firstName,
                lastname : req.body.lastName,
            }
            const query = 'INSERT INTO user (Email, Password, Role, FirstName, LastName) VALUES (?,?,?,?,?)';await User.save(query, datas);
            res.redirect('/entryUser/signin');
        } catch (error) {
            res.redirect('/problem_server');
        }        
    }
}

