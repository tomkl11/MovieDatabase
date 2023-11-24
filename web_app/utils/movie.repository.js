// utils/movie.repository.js
pool = require("../utils/db.js");
// JS include = relative to CONTROLLERS 
// VIEW include = relative to VIEWS
module.exports = {
    getBlankCar(){ // defines the entity model
        return {
            "movie_id": 0,
            "movie_title": "XXXX",
            "movie_gender": "",
            "movie_summary" : null ,
            "movie_grade": 0.0,
            "movie_age_require" : null,
            "movie_language" : "",
            "movie_production_price": 0.0,
            "movie_duration" : 0,
            "movie_projection_format" : ""
        };
    },
    async getAllMovies(){
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM movie";
            const [rows, fields] = await conn.execute(sql);
            conn.release();
            console.log("CARS FETCHED: "+rows.length);
            return rows;
        }
        catch (err) {
            console.log(err);
            throw err; 
        }
    }
};
