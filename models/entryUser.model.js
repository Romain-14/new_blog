import pool from "../config/database/db.js";

class User {

    static async getAllUsersQuery(q){
        const [query] = await pool.execute(q);
        return query;
    }

    static async getUserByField({q, value}){
        const [query] = await pool.execute(q, [value]);
        return query;
    }

    static async save(q, datas){
        const [query] = await pool.execute(q, [...Object.values(datas)]);
        return query;
    }

}

export default User;
