const express = require('express');
const router = express.Router();
const participateRepo = require("../utils/paricipate.repository");
const movieRepo = require("../utils/movie.repository");
const actorRepo = require("../utils/actor.repository");
const {addOneActor, getOneActor} = require("../utils/actor.repository");
const {getBlanckParticipate, addOneParticipate, getAllParticipate} = require("../utils/paricipate.repository");
const {request} = require("express");

router.get ('/actors/:movieId', actor_partcipateListAction);
router.get('/actors/:movieId/edit/:participateId', actor_participateEditAction);
router.get('/movies/:actorId', movie_partcipateListAction);
router.post('/update/:participateId/:movieId/:actorId', participateUpdateAction);
router.get('/delete/:movieId/:participateId', deleteParticipateAction);
async function actor_partcipateListAction(request, response) {
    // response.send("LIST ACTION");
    let movieId = request.params.movieId;
    let actors = await participateRepo.getAllActorsOfMovie(movieId);
    let oneMovie = await movieRepo.getOneMovie(movieId);

    // console.log(movies);
    var flashMessage = request.session.flashMessage; // express-flash ...
    request.session.flashMessage = "";

    response.render("actor_participate", {"oneMovie": oneMovie,"actors": actors, "flashMessage": flashMessage});
}
async function actor_participateEditAction(request, response){
    var idParticipate = request.params.participateId;
    var idMovie = request.params.movieId;
    let header, actors;
    actors = await participateRepo.getAllActorsNotInMovie(idMovie);
    if (idParticipate == "0"){
        header = "add a new actor who participates of this movie"
    }
    else {
        header = "Modify the actor here";
        let participate= await participateRepo.getOneParticipate(idParticipate);
        let actor = await actorRepo.getOneActor(participate.id_actor);
        let index= actors.length;
        actors[index]= {};
        Object.assign(actors[index],actor);
    }
    let oneMovie = await  movieRepo.getOneMovie(idMovie);
    response.render("actor_participate_edit",{"oneMovie": oneMovie,
                    "idParticipate" : idParticipate,
                    "actors": actors,
                    "header" : header});
}
async function participateUpdateAction(request, response){
    let idMovie = request.params.movieId;
    let idActor = request.params.actorId;
    var idParticipate = request.params.participateId, list;
    let role = request.body.role;
    if (idMovie=="0"){
        idMovie = request.body.movie;
        list = "/participate/movies/"+idActor;
    }
    else {
        idActor= request.body.actor;
        list = "/participate/actors/"+idMovie;
    }
    if (idParticipate=="0"){
        let id = await participateRepo.maxId()+1;
        await participateRepo.addOneParticipate(idActor, idMovie, id, role);
    }
    else{
        await participateRepo.editOneParticipate(idParticipate,idActor,idMovie,role);
    }
    response.redirect(list);
}

async function deleteParticipateAction(request, response){
    let movieId = request.params.movieId;
    let participateId = request.params.participateId;
    await participateRepo.delOneParticipate(participateId);
    response.redirect('/participate/actors/'+ movieId);
}
async function movie_partcipateListAction(request, response) {
    // response.send("LIST ACTION");
    let actorId = request.params.actorId;
    let movies = await participateRepo.getAllMoviesOfActor(actorId);
    let oneActor = await actorRepo.getOneActor(actorId);

    // console.log(movies);
    var flashMessage = request.session.flashMessage; // express-flash ...
    request.session.flashMessage = "";

    response.render("movie_participate", {"oneActor": oneActor,"movies": movies, "flashMessage": flashMessage});
}
module.exports = router;