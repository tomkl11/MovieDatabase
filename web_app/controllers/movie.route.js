// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const movieRepo = require('../utils/movie.repository');
router.get('/list', movieListAction);
router.get('/show/:movieId', movieShowAction);
router.get('/delete/:movieId', carDelAction);
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
    response.render("movie_show", { "oneMovie": oneMovie });
}


async function movieEditAction(request, response) {
    var idMovie = request.params.movieId;
    var movie;
    if (idMovie !== "0")
        movie= await movieRepo.getOneMovie(idMovie);
    else
        movie = movieRepo.getBlankMovie();
    response.render("movie_edit", {"oneMovie": movie});
}
async function carDelAction(request, response) {
    var numRows = await movieRepo.delOneMovie(request.params.movieId);
    request.session.flashMessage = "ROWS DELETED: "+numRows;
    response.redirect("/movie/list");
}
async function movieUpdateAction(request, response) {
    // response.send("UPDATE ACTION");
    var movieId = request.params.movieId;
    if (movieId==="0") movieId = await movieRepo.addOneMovie();
    // TODO: BETTER VALIDATION!!!!
    var numRows = await movieRepo.editOneMovie(movieId,
        request.body.movie_title,
        request.body.gender,
        request.body.summary,
        request.body.grade,
        request.body.age_require,
        request.body.language,
        request.body.production_price,
        request.body.duration,
        request.body.projection_format
)
    request.session.flashMessage = "ROWS UPDATED: " + numRows;
    response.redirect("/movie/list");
}

module.exports = router;