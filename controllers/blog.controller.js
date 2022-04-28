import Blog from "../models/blog.model.js";

export const blogPage = async (req,res,next)=>{
    const query = "SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id ORDER BY CreationTimestamp DESC";
    try {
        const [rows] = await Blog.getData(query);
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
    const query1 = 'SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id WHERE Post.Id = ?';
    const query2 = 'SELECT * FROM Comment WHERE Post_Id = ?';
    try {
        const result = await Blog.getOnePostAndCommentsById(id, query1, query2);

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
        nickname : req.body.NickName,
        content : req.body.Content,
        id : req.params.id,
    }
    
    const query = 'INSERT INTO Comment (NickName, Contents, CreationTimestamp, Post_Id) VALUES (?, ?, NOW(), ?)';
    try {
        const result = await Blog.save(query, datas);
        res.redirect("/blog/" + datas.id);
        
    } catch (error) {
        console.log(error);
        res.redirect('/problem_server');
    }
}