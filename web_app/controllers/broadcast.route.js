const express = require('express');
const router = express.Router();
const broadCastRepo = require("../utils/broadcast.repository");
const movieRepo = require("../utils/movie.repository");
const roomRepo = require("../utils/room.repository");
const request = require("express");

router.get ('/rooms/:movieId', room_broadcastListAction);
router.get('/movies/:roomId', movie_broadcastListAction);
router.get('/movies/:roomId/edit/:broadcastId', movie_broadcastEditAction);
router.post('/update/:broadcastId/:roomId', broadcastUpdateAction);
router.get('/delete/:roomId/:broadcastId', deleteBroadcastAction);
async function room_broadcastListAction(request, response) {
    // response.send("LIST ACTION");
    let movieId = request.params.movieId;
    let rooms = await broadCastRepo.getAllRoomsBroadcastMovie(movieId);
    let oneMovie = await movieRepo.getOneMovie(movieId);

    // console.log(movies);
    var flashMessage = request.session.flashMessage; // express-flash ...
    request.session.flashMessage = "";

    response.render("room_broadcast", {"oneMovie": oneMovie,"rooms": rooms, "flashMessage": flashMessage});
}
async function broadcastUpdateAction(request, response){
    let idMovie = request.body.movie;
    let idRoom = request.params.roomId;
    var idBroadcast = request.params.broadcastId, list;
    list = "/broadcast/movies/"+idRoom;
    if (idBroadcast=="0"){
        let id = await broadCastRepo.maxId()+1;
        await broadCastRepo.addOneBroadcast(idRoom, idMovie, id);
    }
    else{
        await broadCastRepo.editOneBroadcast(idBroadcast,idRoom,idMovie);
    }
    response.redirect(list);
}

async function deleteBroadcastAction(request, response){
    let roomId = request.params.roomId;
    let broadcastId = request.params.broadcastId;
    await broadCastRepo.delOneBroadcast(broadcastId);
    response.redirect('/broadcast/movies/'+ roomId);
}
async function movie_broadcastListAction(request, response) {
    // response.send("LIST ACTION");
    let roomId = request.params.roomId;
    let movies = await broadCastRepo.getAllMoviesOfRoom(roomId);
    let oneRoom = await roomRepo.getOneRoom(roomId);

    // console.log(movies);
    var flashMessage = request.session.flashMessage; // express-flash ...
    request.session.flashMessage = "";

    response.render("movie_broadcast", {"oneRoom": oneRoom,"movies": movies, "flashMessage": flashMessage});
}


async function movie_broadcastEditAction(request, response){
    var idBroadcast = request.params.broadcastId;
    var idRoom = request.params.roomId;
    let header, movies;
    movies = await broadCastRepo.getAllMoviesNotInRoom(idRoom);
    if (idBroadcast == "0"){
        header = "add a new movie which broadcasts the movie here"
    }
    else {
        header = "Modify the movie here";
        let broadcast= await broadCastRepo.getOneBroadcast(idBroadcast);
        let movie = await movieRepo.getOneMovie(broadcast.id_movie);
        let index= movies.length;
        movies[index]= {};
        Object.assign(movies[index],movie);
    }
    let oneRoom = await  roomRepo.getOneRoom(idRoom);
    response.render("movie_broadcast_edit",{"oneRoom": oneRoom,
        "idBroadcast" : idBroadcast,
        "movies": movies,
        "header" : header});
}
module.exports = router;