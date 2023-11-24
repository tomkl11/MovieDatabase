const express = require('express');
const router = express.Router();
const carRepo = require('../utils/movie.repository');

router.get('/list', movieListAction);
async function movieListAction(request, response) {
    var cars = await carRepo.getAllMovies();
    response.send(JSON.stringify(cars));
}
module.exports = router;