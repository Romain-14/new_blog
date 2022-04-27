import pool from "../config/database/db.js";

class Blog {

    constructor(id, nickname, content, sql){
        this.id = id;
        this.nickname = nickname;
        this.content = content;
        this.sql = sql;
    }

    static async getAllPosts() {
        const sql = "SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id ORDER BY CreationTimestamp DESC";
        const query = await pool.execute(sql);
        return query;
    }

    static async getOnePostAndCommentsById(id) {
        const sql1 = 'SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id WHERE Post.Id = ?';
        const sql2 = 'SELECT * FROM Comment WHERE Post_Id = ?';
        const [query1] = await pool.execute(sql1, [id]);
        const [query2] = await pool.execute(sql2, [id]);
        return [query1, query2];
    }

    async save(){
        const [query] = await pool.execute(this.sql, [this.nickname, this.content, this.id])
        return query;
    }

}

export default Blog;
