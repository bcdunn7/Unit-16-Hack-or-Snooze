"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFavorites.show();
  $navStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// When a user clicks submit, show story form
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

/**FAVORITE
 * When clicked allow a user to see a list of his/her favorited stories
 */

function navFavoritesClick(evt) {
  console.debug("navFavoriteClick", evt);
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on("click", navFavoritesClick);


/**OWN STORIES
 * when clicked allow a user to see a list of his/her own stories
 */

function navOwnStoriesClick(evt){
  console.debug("navOwnStoriesClick", evt);
  hidePageComponents();
  putOwnStoriesOnPage();
}

$navStories.on("click", navOwnStoriesClick);