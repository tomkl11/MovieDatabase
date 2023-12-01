
const express = require('express');
const router = express.Router();
const roomRepo = require('../utils/room.repository');
router.get('/list', roomListAction);
router.get('/show/:roomId', roomShowAction);
router.get('/delete/:roomId', roomDelAction);
router.get('/edit/:roomId', roomEditAction);
router.post('/update/:roomId', actorUpdateAction);
async function roomListAction(request, response) {
    // response.send("LIST ACTION");
    var rooms = await roomRepo.getAllRooms();
    var flashMessage = request.session.flashMessage; // express-flash ...
    request.session.flashMessage = "";

    response.render("room_list", {"rooms": rooms, "flashMessage": flashMessage});
}
async function roomShowAction(request, response) {
    // response.send("SHOW ACTION");
    var oneRoom = await roomRepo.getOneRoom(request.params.roomId);
    response.render("room_show", { "oneRoom": oneRoom });
}


async function roomEditAction(request, response) {
    var idRoom = request.params.roomId;
    var room;
    let header;
    if (idRoom !== "0"){
        room= await roomRepo.getOneRoom(idRoom);
        header = "Modify this room here";
    }
    else{
        room = roomRepo.getBlankRooms();
        header = "Add a new room here";
    }
    response.render("room_edit", {"oneRoom": room, "header": header});
}
async function roomDelAction(request, response) {
    var numRows = await roomRepo.delOneRoom(request.params.roomId);
    request.session.flashMessage = "ROWS DELETED: "+numRows;
    response.redirect("/room/list");
}
async function actorUpdateAction(request, response) {
    // response.send("UPDATE ACTION");
    var idRoom = request.params.roomId;
    if (idRoom==="0")  idRoom= await roomRepo.addOneRoom();
    // TODO: BETTER VALIDATION!!!!
    var numRows = await roomRepo.editOneRoom(idRoom,
        request.body.cinema_name,
        request.body.Floor,
        request.body.area,
        request.body.capacity,
        request.body.format_screen,
)
    request.session.flashMessage = "ROWS UPDATED: " + numRows;
    response.redirect("/room/list");
}

module.exports = router;