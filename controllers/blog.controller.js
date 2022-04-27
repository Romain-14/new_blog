import Blog from "../models/blog.model.js";

export const blogPage = async (req,res,next)=>{
    try {
        const [rows] = await Blog.getAllPosts();
        res.render('layout', {
                template: "blog",
                posts: rows,
            });
        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}


export const onePostPage = async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await Blog.getOnePostAndCommentsById(id);

        if(!result[0].length){
            res.redirect('/pageNotFound');
        }else {
            res.render('layout', {template:'onePost', post: result[0][0], comments: result[1] });
        }
        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}

export const addComment = async (req,res, next) =>{
    
    const datas = {
        id : req.params.id,
        nickname : req.body.NickName,
        content : req.body.Content,
        sql: 'INSERT INTO Comment (NickName, Contents, CreationTimestamp, Post_Id) VALUES (?, ?, NOW(), ?)',
    }

    try {        
        const newComment = new Blog(datas.id, datas.nickname, datas.content, datas.sql);
        const result = await newComment.save();
        res.redirect("/blog/" + datas.id);
        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}