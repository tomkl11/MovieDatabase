
// utils/movie.repository.js
pool = require("../utils/db.js");

// JS include = relative to CONTROLLERS 
// VIEW include = relative to VIEWS
module.exports = {
    getBlankMovie() { // defines the entity model
        return {
            "id_movie": 0,
            "movie_title": "",
            "gender": "",
            "summary": null,
            "grade": 0.0,
            "age_require": null,
            "language": "xxxx",
            "production_price": 0.0,
            "duration": 0,
            "projection_format": "00:00"
        };
    },
    async getAllMovies() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM MOVIE";
            const [rows, fields] = await conn.execute(sql);
            conn.release();
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async getOneMovie(movieId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM MOVIE WHERE  id_movie = ?";
            console.log(movieId);
            const [rows, fields] = await conn.execute(sql, [movieId]);
            conn.release();
            console.log("CARS FETCHED: " + rows.length);
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
    async delOneMovie(movieId){
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM MOVIE WHERE id_movie = ?";
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
    async addOneMovie() {
        try {
            let conn = await pool.getConnection();
            let sql = "INSERT INTO MOVIE (id_movie, gender ) VALUES (NULL,'') ";
            const [okPacket, fields] = await conn.execute(sql, [] );
            conn.release();
            console.log("INSERT " + JSON.stringify(okPacket));
            return okPacket.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    async editOneMovie(movieId, movie_title, gender, summary, grade, age_require, language, production_price, duration, projection_format) {
        try {
            let conn = await pool.getConnection();
            if (age_require==''){
                age_require = null;
            }
            let sql = "UPDATE MOVIE SET movie_title=?, gender=?, summary=?, grade=?, age_require=?, language_=?, production_price=?, duration=?, projection_format= ?" +
                " WHERE  id_movie = ? ";// TODO: named parameters? :something
            const [okPacket, fields] = await conn.execute(sql,
                [movie_title, gender, summary, grade, age_require, language, production_price, duration, projection_format, movieId]);
            conn.release();
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
};
