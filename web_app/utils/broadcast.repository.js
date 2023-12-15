
// utils/movie.repository.js
pool = require("../utils/db.js");
const roomRepo = require("../utils/room.repository");
const movieRepo = require("../utils/movie.repository");
var lastId =0;

// JS include = relative to CONTROLLERS 
// VIEW include = relative to VIEWS
module.exports = {
    getBlanckBroadcast(){
        return {
            "id_actor" : null,
            "id_movie" : null,
            "id" : 0,
        };
    },
    async getAllRoomsBroadcastMovie(movieId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Room INNER JOIN broadcast ON Room.id_room = broadcast.id_room  WHERE  id_movie = ?";
            console.log(movieId);
            const [rows, fields] = await conn.execute(sql, [movieId]);
            conn.release();
            console.log("participateOfMovie FETCHED: " + rows.length);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async getAllRoomsNotBroadcastMovie(movieId) {
        let rooms = await roomRepo.getAllRooms();
        let roomssInMovie = await this.getAllRoomsBroadcastMovie(movieId);
        var roomsOut = []
        for (var room of rooms){
            let broadCastMovie = false;
            var i = 0;
            while (!broadCastMovie && i< roomssInMovie.length){
                broadCastMovie = roomssInMovie[i].id_room===room.id_room;
                i++;
            }
            if (!broadCastMovie){
                const index = roomsOut.length;
                roomsOut[index]= {};
                Object.assign(roomsOut[index], room);
            }
        }
        return roomsOut;
    },
    async getOneBroadcast(broadcastId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM broadcast WHERE  id = ?";
            console.log(broadcastId);
            const [rows, fields] = await conn.execute(sql, [broadcastId]);
            conn.release();
            console.log("broadcast FETCHED: " + rows.length);
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
    async delOneBroadcast(broadcastId){
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM broadcast WHERE id = ?";
            const [okPacket, fields] = await conn.execute(sql, [ broadcastId ]);
            conn.release();
            console.log("DELETE "+JSON.stringify(okPacket));
            return okPacket.affectedRows;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    async delAllBroadcastOfMovie(movieId){
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM broadcast WHERE id_movie = ?";
            const [okPacket, fields] = await conn.execute(sql, [ movieId ]);
            conn.release();
            console.log("DELETE "+JSON.stringify(okPacket));
            return okPacket.affectedRows;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    async delAllBroadcastOfRoom(roomId){
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM broadcast WHERE id_room = ?";
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
    async maxId(){
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT max(id) as id From broadcast";
            const [row, fields] = await conn.execute(sql, [] );
            conn.release();
            if (row[0].id != null){
                return row[0].id;
            }
            return 0;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async addOneBroadcast(roomId, movieId, id){
        try {
            let conn = await pool.getConnection();
            let sql = "INSERT INTO broadcast (id_room,id_movie,id) VALUES (?,?,?) ";
            const [okPacket, fields] = await conn.execute(sql, [roomId,movieId,id] );
            conn.release();
            console.log("INSERT " + JSON.stringify(okPacket));
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async editOneBroadcast(broadcastId, roomId, movieId) {
        try {
            let conn = await pool.getConnection();
            let sql = "UPDATE broadcast SET id_room=?, id_movie=? WHERE  id = ? ";// TODO: named parameters? :something
            const [okPacket, fields] = await conn.execute(sql,
                [roomId, movieId, broadcastId ]);
            conn.release();
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async getAllMoviesOfRoom(roomId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Movie INNER JOIN broadcast ON Movie.id_movie = broadcast.id_movie  WHERE  id_room = ?";
            console.log(roomId);
            const [rows, fields] = await conn.execute(sql, [roomId]);
            conn.release();
            console.log("participateOfMovie FETCHED: " + rows.length);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async getAllMoviesNotInRoom(roomId) {
        let movies = await movieRepo.getAllMovies();
        let moviesInRoom = await this.getAllMoviesOfRoom(roomId);
        var moviesOut = []
        for (var movie of movies){
            let broadCastRoom = false;
            var i = 0;
            while (!broadCastRoom && i< moviesInRoom.length){
                broadCastRoom = moviesInRoom[i].id_movie===movie.id_movie;
                i++;
            }
            if (!broadCastRoom){
                const index = moviesOut.length;
                moviesOut[index]= {};
                Object.assign(moviesOut[index], movie);
            }
        }
        return moviesOut;
    }

};
