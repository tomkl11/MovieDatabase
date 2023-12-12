// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const movieRepo = require('../utils/movie.repository');
const participateRepo = require('../utils/paricipate.repository');
const broadcastRepo = require('../utils/broadcast.repository');
const {delAllParticipateOfMovie} = require("../utils/paricipate.repository");
router.get('/list', movieListAction);
router.get('/show/:movieId', movieShowAction);
router.get('/delete/:movieId', movieDelAction);
router.get('/edit/:movieId', movieEditAction);
router.post('/update/:movieId', movieUpdateAction);

async function movieListAction(request, response) {
    // response.send("LIST ACTION");
    var movies = await movieRepo.getAllMovies();

    // console.log(movies);
    var flashMessage = request.session.flashMessage; // express-flash ...
    request.session.flashMessage = "";

    response.render("movie_list", {"movies": movies, "flashMessage": flashMessage});
}

async function movieShowAction(request, response) {
    // response.send("SHOW ACTION");
    var oneMovie = await movieRepo.getOneMovie(request.params.movieId);
    response.render("movie_show", {"oneMovie": oneMovie});
}


async function movieEditAction(request, response) {
    var idMovie = request.params.movieId;
    var movie;
    let header;
    if (idMovie !== "0"){
        header = "Modify this new movie here";
        movie = await movieRepo.getOneMovie(idMovie);
    }
    else{
        header = "Add a movie here";
        movie = movieRepo.getBlankMovie();
    }
    response.render("movie_edit", {"oneMovie": movie, "header" : header});
}

async function movieDelAction(request, response) {
    let idMovie = request.params.movieId;
    await participateRepo.delAllParticipateOfMovie(idMovie);
    await broadcastRepo.delAllBroadcastOfMovie(idMovie);
    var numRows = await movieRepo.delOneMovie(idMovie);
    request.session.flashMessage = "ROWS DELETED: " + numRows;

    response.redirect("/movie/list");
}

async function movieUpdateAction(request, response) {
    // response.send("UPDATE ACTION");
    var movieId = request.params.movieId;
    if (movieId === "0") movieId = await movieRepo.addOneMovie();
    // TODO: BETTER VALIDATION!!!!
    var numRows = await movieRepo.editOneMovie(movieId,
        request.body.movie_title,
        request.body.gender,
        request.body.summary,
        request.body.grade,
        request.body.age_require,
        request.body.languages,
        request.body.production_price,
        request.body.duration,
        request.body.projection_format
    )
    request.session.flashMessage = "ROWS UPDATED: " + numRows;
    response.redirect("/movie/list");
}


module.exports = router;