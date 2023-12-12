// controllers/auth.route.js
const express = require('express');
const router = express.Router();
const auth = require("../utils/users.auth");
const userRepo = require("../utils/users.repository");

router.get('/', (req, res) => res.render('auth_view', { extraContent: "" }) );
router.get("/user", auth.checkAuthentication("USER"), userAction);
router.get("/admin", auth.checkAuthentication("ADMIN"), userAction);
router.get("/protected", protectedGetAction);
router.post("/login", loginPostAction);
router.get("/logout", logoutAction);
router.get("/edit/:userId",UserEditAction)
router.post("/signUp", signUpAction);

async function userAction(request, response) {
  let userData = await userRepo.getOneUser(request.user.user_name);
  let userJson = JSON.stringify(userData); // if  userData.user_role ...
  response.render("auth_view", { "extraContent": userJson });
}

async function protectedGetAction(request, response) {
  if (request.isAuthenticated()) {
    if (request.user.user_role === "ADMIN") {
      response.redirect("/auth/admin");
    } else {
      response.redirect("/auth/user");
    }
  } else {
      response.redirect("/auth");
  }
}

async function loginPostAction(request, response) {
  areValid = await userRepo.areValidCredentials(request.body.user_name, request.body.password);

  if (areValid) {
    user = await userRepo.getOneUser(request.body.username);
    request.login(user, function (err) { 
        if (err) { console.log("ERROR"); console.log(err); return next(err); }

        if (request.user.user_role === "ADMIN") {
            return response.redirect("/auth/admin");
        } else {
            return response.redirect("/auth/user");
        }
    });
  } else {
    response.send("Invalid credentials provided");
    // TODO redirect/normal error message
  }
}

function logoutAction(request, response) {
    request.logout(function(err) {
        if (err) { return next(err); }
        response.redirect('/auth');
    });
}

async function UserEditAction(request,response){
    let OneUser = userRepo.getBlankUser();
    response.render("user_edit", {"OneUser" : OneUser});
}
async function signUpAction(request,response){
    await userRepo.addOneUser(
        request.body.user_name,
        request.body.email,
        request.body.user_role,
        request.body.password);
    response.redirect('/movie/list');

}
module.exports = router;