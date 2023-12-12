pool = require("../utils/db.js");

module.exports = {
  getBlankUser() { // defines the entity model
    return {
      "id_user": 0,
      "user_created": "",
      "user_name": "",
      "email": "",
      "user_role" : "",
      "password" : ""
    };
  },
  async getOneUser(username) {
    try {
      let conn = await pool.getConnection();
      let sql = "SELECT user_id,user_name,user_email,user_role FROM users WHERE user_name = ? "; 
      // must leave out the password+hash
      const [rows, fields] = await conn.execute(sql, [ username ]);
      conn.release();

      if (rows.length == 1) {
        return rows[0];
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
  async areValidCredentials(username, password) {
    try {
      let conn = await pool.getConnection();
      let sql = "SELECT * FROM USERS WHERE user_name = ? AND password= ?";
      // TODO: better salt+pw hash - COLLATE usually not needed
      const [rows, fields] = await conn.execute(sql, [username, password]);
      conn.release();

      console.log(sql);
      console.log(username);
      console.log(password);
      console.log(rows);
      if (rows.length == 1 && rows[0].user_name === username) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  async addOneUser(user_name,email,user_role,password) {
    try {
      let conn = await pool.getConnection();
      let sql = "INSERT INTO USERS (id_user,user_created,user_name,email,user_role,password)" +
          "VALUES (NULL,NOW(),?,?,?,?)";
      const [okPacket, fields] = await conn.execute(sql,
          [user_name, email, user_role, password]);
      conn.release();
      console.log("INSERT " + JSON.stringify(okPacket));
      return okPacket.insertId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}; 