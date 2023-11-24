// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const carRepo = require('../utils/movie.repository');

router.get('/list', movieListAction);
async function mynameAction(request, response) {
    response.send("MYNAME ACTION "+request.params.name);
}




async function movieListAction(request, response) {
    // response.send("LIST ACTION");
    var movies = await carRepo.getAllMovies();
    // console.log(movies);
    var flashMessage = request.session.flashMessage; // express-flash ...
    request.session.flashMessage = "";

    response.render("movie_list", { "movies": movies, "flashMessage": flashMessage });
}

module.exports = router;