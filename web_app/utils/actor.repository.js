
// utils/movie.repository.js
pool = require("../utils/db.js");

// JS include = relative to CONTROLLERS 
// VIEW include = relative to VIEWS
module.exports = {
    getBlankActor() { // defines the entity model
        return {
            "id_actor": 0,
            "name": "",
            "rewards": null,
            "birthdate" : "XXXX/XX/XX",
            "nationality": ""
        };
    },
    async getAllActors() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM ACTOR";
            const [rows, fields] = await conn.execute(sql);
            conn.release();
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async getOneActor(actorId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM ACTOR WHERE  id_actor = ?";
            console.log(actorId);
            const [rows, fields] = await conn.execute(sql, [actorId]);
            conn.release();
            console.log("ACTOR FETCHED: " + rows.length);
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
    async delOneActor(actorId){
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM ACTOR WHERE id_actor = ?";
            const [okPacket, fields] = await conn.execute(sql, [ actorId ]);
            conn.release();
            console.log("DELETE "+JSON.stringify(okPacket));
            return okPacket.affectedRows;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    async addOneActor() {
        try {
            let conn = await pool.getConnection();
            let sql = "INSERT INTO ACTOR (id_actor,name,birthdate,nationality) VALUES (NULL,'','2001/01/01','') ";
            const [okPacket, fields] = await conn.execute(sql, [] );
            conn.release();
            console.log("INSERT " + JSON.stringify(okPacket));
            return okPacket.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async editOneActor(actorId, name, rewards, birthdate, nationality) {
        try {
            let conn = await pool.getConnection();
            let sql = "UPDATE ACTOR SET name=?, rewards=?, birthdate=?, nationality=?" +
                " WHERE  id_actor = ? ";// TODO: named parameters? :something
            const [okPacket, fields] = await conn.execute(sql,
                [name, rewards, birthdate, nationality, actorId]);
            conn.release();
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
};
