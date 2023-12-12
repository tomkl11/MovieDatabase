const express = require('express');
const router = express.Router();
const broadCastRepo = require("../utils/broadcast.repository");
const movieRepo = require("../utils/movie.repository");
const roomRepo = require("../utils/room.repository");
const request = require("express");

router.get ('/rooms/:movieId', room_broadcastListAction);
router.get('/rooms/:movieId/edit/:broadcastId', room_broadcastEditAction);
router.get('/movies/:roomId', movie_broadcastListAction);
router.post('/update/:broadcastId/:movieId/:roomId', broadcastUpdateAction);
router.get('/delete/:movieId/:broadcastId', deleteBroadcastAction);
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
async function room_broadcastEditAction(request, response){
    var idBroadcast = request.params.broadcastId;
    var idMovie = request.params.movieId;
    let header, rooms;
    rooms = await broadCastRepo.getAllRoomsNotBroadcastMovie(idMovie);
    if (idBroadcast == "0"){
        header = "add a new room which broadcasts the movie here"
    }
    else {
        header = "Modify the room here";
        let broadcast= await broadCastRepo.getOneBroadcast(idBroadcast);
        let room = await roomRepo.getOneRoom(broadcast.id_room);
        let index= rooms.length;
        rooms[index]= {};
        Object.assign(rooms[index],room);
    }
    let oneMovie = await  movieRepo.getOneMovie(idMovie);
    response.render("room_broadcast_edit",{"oneMovie": oneMovie,
                    "idBroadcast" : idBroadcast,
                    "rooms": rooms,
                    "header" : header});
}
async function broadcastUpdateAction(request, response){
    let idMovie = request.params.movieId;
    let idRoom = request.params.roomId;
    var idBroadcast = request.params.broadcastId, list;
    if (idMovie=="0"){
        idMovie = request.body.movie;
        list = "/broadcast/movies/"+idRoom;
    }
    else {
        idRoom= request.body.room;
        list = "/broadcast/rooms/"+idMovie;
    }
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
    let movieId = request.params.movieId;
    let broadcastId = request.params.broadcastId;
    await broadCastRepo.delOneBroadcast(broadcastId);
    response.redirect('/broadcast/rooms/'+ movieId);
}
async function movie_broadcastListAction(request, response) {
    // response.send("LIST ACTION");
    let actorId = request.params.actorId;
    let movies = await broadCastRepo.getAllMoviesOfActor(actorId);
    let oneActor = await roomRepo.getOneActor(actorId);

    // console.log(movies);
    var flashMessage = request.session.flashMessage; // express-flash ...
    request.session.flashMessage = "";

    response.render("movie_participate", {"oneActor": oneActor,"movies": movies, "flashMessage": flashMessage});
}
module.exports = router;