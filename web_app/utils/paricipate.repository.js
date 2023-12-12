
// utils/movie.repository.js
pool = require("../utils/db.js");
const actorRepo = require("../utils/actor.repository");
var lastId =0;

// JS include = relative to CONTROLLERS 
// VIEW include = relative to VIEWS
module.exports = {
    getBlanckParticipate(){
        return {
            "id_actor" : null,
            "id_movie" : null,
            "id" : 0,
            "role" : null
        };
    },
    async getAllActorsOfMovie(movieId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Actor INNER JOIN partcipate ON Actor.id_actor = partcipate.id_actor  WHERE  id_movie = ?";
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
    async getAllActorsNotInMovie(movieId) {
        let actors = await actorRepo.getAllActors();
        let actorsInMovie = await this.getAllActorsOfMovie(movieId);
        var actorsOut = []
        for (var actor of actors){
            let isInMovie = false;
            var i = 0;
            while (!isInMovie && i< actorsInMovie.length){
                isInMovie = actorsInMovie[i].id_actor===actor.id_actor;
                i++;
            }
            if (!isInMovie){
                const index = actorsOut.length;
                actorsOut[index]= {};
                Object.assign(actorsOut[index], actor);
            }
        }
        return actorsOut;
    },
    async getAllParticipate() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM partcipate";
            const [rows, fields] = await conn.execute(sql);
            conn.release();
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async getOneParticipate(participateId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM partcipate WHERE  id = ?";
            console.log(participateId);
            const [rows, fields] = await conn.execute(sql, [participateId]);
            conn.release();
            console.log("partcipate FETCHED: " + rows.length);
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
    async delOneParticipate(participateId){
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM partcipate WHERE id = ?";
            const [okPacket, fields] = await conn.execute(sql, [ participateId ]);
            conn.release();
            console.log("DELETE "+JSON.stringify(okPacket));
            return okPacket.affectedRows;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },async delAllParticipateOfMovie(movieId){
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM partcipate WHERE id_movie = ?";
            const [okPacket, fields] = await conn.execute(sql, [ movieId ]);
            conn.release();
            console.log("DELETE "+JSON.stringify(okPacket));
            return okPacket.affectedRows;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },async delAllParticipateOfActor(movieId){
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM partcipate WHERE id_actor = ?";
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
    async maxId(){
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT max(id) as id From partcipate";
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
    async addOneParticipate(actorId, movieId,id, role){
        try {
            let conn = await pool.getConnection();
            let sql = "INSERT INTO partcipate (id_actor,id_movie,id,role) VALUES (?,?,?, ?) ";
            const [okPacket, fields] = await conn.execute(sql, [actorId,movieId,id, role] );
            conn.release();
            console.log("INSERT " + JSON.stringify(okPacket));
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async editOneParticipate(participateId, actorId, movieId, role) {
        try {
            let conn = await pool.getConnection();
            let sql = "UPDATE partcipate SET id_actor=?, id_movie=?, role = ? WHERE  id = ? ";// TODO: named parameters? :something
            const [okPacket, fields] = await conn.execute(sql,
                [actorId, movieId, role,participateId ]);
            conn.release();
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async getAllMoviesOfActor(actorId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Movie INNER JOIN partcipate ON Movie.id_movie = partcipate.id_movie  WHERE  id_actor = ?";
            console.log(actorId);
            const [rows, fields] = await conn.execute(sql, [actorId]);
            conn.release();
            console.log("participateOfMovie FETCHED: " + rows.length);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

};
