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
    res.render('actor_view', { favourites: [] });
});

// http://localhost:9000/hello/world
router.get('/information', (req, res) => {
    //res.send('Hello WORLD, from controller...');
    res.render('actor_view', { favourites: [
        { category: 'cheese', thing: 'raclette' },
        { category: 'book', thing: 'Umberto Eco: Foucaults pendulum' },
        { category: 'drink', thing: 'cidre brut' },
        { category: 'color', thing: 'green (allez les Verts! ;) ' },
    ] });
});

module.exports = router;