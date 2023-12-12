
const express = require('express');
const router = express.Router();
const actorRepo = require('../utils/actor.repository');
const participateRepo = require("../utils/paricipate.repository");
router.get('/list', actorListAction);
router.get('/show/:actorId', actorShowAction);
router.get('/delete/:actorId', actorDelAction);
router.get('/edit/:actorId', actorEditAction);
router.post('/update/:actorId', actorUpdateAction);
async function actorListAction(request, response) {
    // response.send("LIST ACTION");
    var actors = await actorRepo.getAllActors();
    var flashMessage = request.session.flashMessage; // express-flash ...
    request.session.flashMessage = "";

    response.render("actor_list", {"actors": actors, "flashMessage": flashMessage});
}
async function actorShowAction(request, response) {
    // response.send("SHOW ACTION");
    var oneActor = await actorRepo.getOneActor(request.params.actorId);
    response.render("actor_show", { "oneActor": oneActor });
}


async function actorEditAction(request, response) {
    var idActor = request.params.actorId;
    var actor;
    let header;
    if (idActor !== "0"){
        actor= await actorRepo.getOneActor(idActor);
        header = "Modify this actor here";
    }
    else{
        actor = actorRepo.getBlankActor();
        header = "Add a new actor here"
    }
    response.render("actor_edit", {"oneActor": actor, "header": header});
}
async function actorDelAction(request, response) {
    let actorId = request.params.actorId;
    await participateRepo.delAllParticipateOfMovie(actorId);
    var numRows = await actorRepo.delOneActor(actorId);
    request.session.flashMessage = "ROWS DELETED: "+numRows;
    response.redirect("/actor/list");
}
async function actorUpdateAction(request, response) {
    // response.send("UPDATE ACTION");
    var actorId = request.params.actorId;
    if (actorId==="0") actorId = await actorRepo.addOneActor();
    // TODO: BETTER VALIDATION!!!!
    var numRows = await actorRepo.editOneActor(actorId,
        request.body.name,
        request.body.rewards,
        request.body.birthdate,
        request.body.nationality,
)
    request.session.flashMessage = "ROWS UPDATED: " + numRows;
    response.redirect("/actor/list");
}

module.exports = router;