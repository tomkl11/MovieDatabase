const express = require('express');
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

// ca c'est une route simple, pour l'URL "/" il te répond response.send
app.get('/', (request, response) => {
    let clientIp = request.ip;
    response.send(`Hello, dear ${clientIp}. I am a nodejs website...`);
    response.end(); // optional
});

// ca fait en sorte que tout ce qu'il y a dans le dossier /static soit accessible sur le site à /static (donc pour css, js, img)
app.use("/static", express.static(__dirname + '/static'));

// ça ça associe au chemin /hello toutes les routes qui sont décrites dans controllers/hello.route.js
app.use("/hello", require("./controllers/hello.route"));