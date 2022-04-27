import pool from "../config/database/db.js";

class User {

    constructor(id, email, password, role,firstname, lastname, sql ){
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.firstname = firstname;
        this.lastname = lastname;
        this.sql = sql;
    }

    static async getUserByEmail(email, sql){
        const [query] = await pool.execute(sql, [email]);
        return query;
    }

    async save(){
        const [query] = await pool.execute(this.sql, [this.email, this.password, this.role, this.firstname, this.lastname])
        return query;
    }




}

export default User;
