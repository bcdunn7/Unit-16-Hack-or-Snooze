"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let isSelected = '';
  let isHidden = true;
    if (currentUser) {
    for (let i = 0; i < currentUser.favorites.length; i++) {
      if (currentUser.favorites[i].storyId === story.storyId) {
        isSelected = '-selected';
      }
    }
    for (let i = 0; i < currentUser.ownStories.length; i++) {
      if (currentUser.ownStories[i].storyId === story.storyId) {
        isHidden = false;
      }
    }
  }
  return $(`
      <li id="${story.storyId}">
      <button id="${story.storyId}" class="favorite-btn favorite-btn${isSelected}"><i class="fas fa-star"></i></button>
      <button id="${story.storyId}" class="trash-btn ${isHidden ? "hidden" : "" }"><i class="far fa-trash-alt"></i></button>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//** Set favorite or unfavorite*/

async function handleClick(evt){

  //if user logged in
  if (currentUser){
    //get data
    const storyId = evt.target.parentElement.id;
    const username = currentUser.username;
    const token = currentUser.loginToken;
    const story = storyList.stories.find(story => story.storyId === storyId);
    
    //FAVORITE
    //if click was on the favorite icon
    if (evt.target.className === 'fas fa-star'){

      //logic to see if favorite or not already
      //add favorite
      if (Array.from(evt.target.parentElement.classList).indexOf('favorite-btn-selected') === -1) {
      
        //change DOM color
        evt.target.parentElement.classList.add('favorite-btn-selected');

        //need storyId, username and token to then pass to func which updates API
        currentUser.setFavorite(username, storyId, token, story);
      }
      //remove favorite
      else if (Array.from(evt.target.parentElement.classList).indexOf('favorite-btn-selected') !== -1){
        //change DOM
        evt.target.parentElement.classList.remove('favorite-btn-selected')

        //update API
        currentUser.removeFavorite(username, storyId, token, story);
      }
    }

    //DELETE
    //if click was on the delete icon
    if (evt.target.className === 'far fa-trash-alt') {
      await removeUserStory(currentUser, story, evt);
      evt.target.parentElement.parentElement.remove();
    }
  }
}

$('.stories-container').on('click', handleClick);

/**Get a list of favorited stories from server and generate HTML and put on page */

async function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoriteStoriesList.empty();

  //Find favorites and generate HTML for them
  //find favorite story ids
  const userFavoritesIds = currentUser.favorites.map(function(favorite) {
    return favorite.storyId;
  })

  //check if no favorites
  if (userFavoritesIds.length === 0) {$favoriteStoriesList.append("<h3>No Favorites Currently</h3>")}

  //add favorites to page
  else {
    for (let story of storyList.stories) {
      if (userFavoritesIds.indexOf(story.storyId) !== -1) {
        const $story = generateStoryMarkup(story);
      $favoriteStoriesList.append($story);
      }
    }
  }

  $favoriteStoriesList.show();
}


/**USER STORIES */
// User Story submission 

async function addUserStorySubmission(e) {
  e.preventDefault();

  const postTitle = $('#post-title').val(); 
  const postAuthor = $('#post-author').val(); 
  const postURL = $('#post-URL').val(); 

  const storyData = {title: `${postTitle}`, author: `${postAuthor}`, url: `${postURL}`}

  //API
  const story = await storyList.addStory(currentUser, storyData);
  //USER
  currentUser.ownStories.unshift(story);
  //HTML generation
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  
  $submitForm.trigger("reset");
  $submitForm.hide();
   
  $allStoriesList.show();
}

$submitForm.on("submit", addUserStorySubmission);

//delete user story
async function removeUserStory(currentUser, story, evt) {
  //update API
  const responce = await storyList.removeStory(currentUser, story);

  //Update User
  currentUser.ownStories = currentUser.ownStories.filter(s => s.storyId !== story.storyId);  
}

//display own stories
async function putOwnStoriesOnPage(){
  console.debug("putOwnStoriesOnPage");

  $ownStoriesList.empty();

  //find own stories and generate HTML for them
  const userStoriesIds = currentUser.ownStories.map(function(story) {
    return story.storyId;
  })

  if (userStoriesIds.length === 0) {
    $ownStoriesList.append("<h3>No User Stories Currently</h3>")
  }

  else {
    for (let story of storyList.stories) {
      if (userStoriesIds.indexOf(story.storyId) !== -1) {
        const $story = generateStoryMarkup(story);
        $ownStoriesList.append($story)
      }
    }
  }

  $ownStoriesList.show();
};