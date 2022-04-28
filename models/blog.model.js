import pool from "../config/database/db.js";

class Blog {

    // on peut trés bien instancier la class et passer sur des méthodes non static
    constructor(id, nickname, content, query){
        this.id = id;
        this.nickname = nickname;
        this.content = content;
        this.query = query;
    }

    static async getData(q) {        
        const query = await pool.execute(q);
        return query;
    }

    static async getDataWithParam(q, id){
        const query = await pool.query(q,id);
        return query;
    }

    static async getDatas(q1, q2){
        const [query1] = await pool.execute(q1);
        const [query2] = await pool.execute(q2);    
        return [query1, query2];
    }

    static async getOnePostAndCommentsById(id, q1, q2) {        
        const [query1] = await pool.execute(q1, [id]);
        const [query2] = await pool.execute(q2, [id]);
        return [query1, query2];
    }

    static async save(q, datas){
        console.log(datas);
        const [query] = await pool.execute(q, [...Object.values(datas)]);
        return query;
    }
}

export default Blog;
