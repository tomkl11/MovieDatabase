
// utils/movie.repository.js
pool = require("../utils/db.js");

// JS include = relative to CONTROLLERS 
// VIEW include = relative to VIEWS
module.exports = {
    getBlankRooms() { // defines the entity model
        return {
            "id_room": 0,
            "cinema_name": "xxxx",
            "Floor": 0,
            "area": 0,
            "capacity" : 0,
            "format_screen" : "100x100"
        };
    },
    async getAllRooms() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM ROOM";
            const [rows, fields] = await conn.execute(sql);
            conn.release();
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async getOneRoom(roomId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM ROOM WHERE  id_room = ?";
            console.log(roomId);
            const [rows, fields] = await conn.execute(sql, [roomId]);
            conn.release();
            console.log("ROOM FETCHED: " + rows.length);
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
    async delOneRoom(roomId){
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM ROOM WHERE id_room = ?";
            const [okPacket, fields] = await conn.execute(sql, [ roomId ]);
            conn.release();
            console.log("DELETE "+JSON.stringify(okPacket));
            return okPacket.affectedRows;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    async addOneRoom() {
        try {
            let conn = await pool.getConnection();
            let sql = "INSERT INTO ROOM (id_room,cinema_name,Floor,area,capacity,format_screen) VALUES (NULL,'',0,0,0,'') ";
            const [okPacket, fields] = await conn.execute(sql, [] );
            conn.release();
            console.log("INSERT " + JSON.stringify(okPacket));
            return okPacket.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async editOneRoom(roomId, cinema_name, Floor, area, capacity, format_screen) {
        try {
            let conn = await pool.getConnection();
            let sql = "UPDATE ROOM SET cinema_name=?, Floor=?, area=?, capacity=?, format_screen=?" +
                " WHERE  id_room = ? ";// TODO: named parameters? :something
            const [okPacket, fields] = await conn.execute(sql,
                [cinema_name, Floor, area, capacity, format_screen, roomId]);
            conn.release();
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
};
