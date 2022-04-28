import Blog from "../models/blog.model.js";

export const adminPage = async (req,res,next)=>{
    try {
        res.render('layout', {
                template: "admin/admin",
            });
        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}

export const addPostPage = async (req,res,next)=>{
    
    const datas = {
        query1: 'SELECT * FROM Author',
        query2: 'SELECT * FROM Category',
    }
    try {
        const rows = await Blog.getDatas(datas.query1, datas.query2);
        res.render('layout', {
                template: "admin/add_post",
                authors: rows[0],
                categories: rows[1],
            });        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}

export const postsListPage = async (req,res,next)=>{
    const query = "SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id ORDER BY CreationTimestamp DESC";
    try {
        const [rows] = await Blog.getData(query);
        res.render('layout', {
                template: "admin/posts_list",
                posts: rows,
            });        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}

export const commentsListPage = async (req,res,next)=>{
    const query = 'SELECT * FROM Comment';
    try {
        const [rows] = await Blog.getData(query);
        console.log(rows);
        res.render('layout', {
                template: "admin/comments_list",
                comments: rows,
            });        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}
export const usersListPage = async (req,res,next)=>{
    try {
        res.render('layout', {
                template: "admin/users_list",                
            });        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}

export const editPostPage = async (req, res, next) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Post WHERE id = ?';
    try {
        const [post] = await Blog.getDataWithParam(query, id);
        res.render('layout', {
            template: "admin/edit_post",
            post: post[0],
        });        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}

export const addPost = async (req,res,next) => {
    const datas = {
        title: req.body.title,
        content: req.body.content.trim(),
        author: req.body.author,
        category: req.body.category,        
    }  
    const query = 'INSERT INTO Post (Title, Contents, Author_Id, Category_Id, CreationTimestamp) VALUES (?, ?, ?, ?, NOW())';  
    try {
        const result = await Blog.save(query, datas);   
        res.redirect("/admin");
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}