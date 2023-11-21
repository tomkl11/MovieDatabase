// controllers/hello.route.js
const express = require('express');
const router = express.Router();

router.get('/my/:name', mynameAction);
router.get('/myy', mynameAction);
async function mynameAction(request, response) {
    response.send("MYNAME ACTION "+request.params.name);
}


// http://localhost:9000/hello
router.get('/', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('movie_view', { favourites: [] });
});

// http://localhost:9000/hello/world
router.get('/world2', (req, res) => {
    //res.send('Hello WORLD, from controller...');
    res.render('movie_view', { favourites: [
        { category: 'comedy', thing: 'Movie1' },
        { category: 'adventure', thing: 'Movie2' },
        { category: 'horror', thing: 'Movie3' },
        { category: 'dramatic', thing: 'Movie4' },
    ] });
});

module.exports = router;