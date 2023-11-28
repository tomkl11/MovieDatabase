const express = require('express');
const router = express.Router();
const carRepo = require('../utils/movie.repository');

router.get('/list', movieListAction);
router.get('/show/:movieId', carShowAction);
async function movieListAction(request, response) {
    var movies = await carRepo.getAllMovies();
    response.send(JSON.stringify(movies));
}

module.exports = router;