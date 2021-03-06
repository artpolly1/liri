/* LIRI is a Language Interpretation and Recognition Interface.
Using nodeJS's process.argv ,LIRI takes in an action request and an argument,
such as a movie-title and retrieves information on one of the following: 
movies, music and events. */

//required to retrieve the keys stored in the .env file
//=======================================================================
require('dotenv').config();



//Global varibles 
//=======================================================================
const Spotify = require('node-spotify-api');
const ticketmaster = require("ticketmaster");
const omdb = require('omdb');
const axios = require('axios');
const fs = require("fs");
const action = process.argv[2];
const argument = process.argv[3];





//functions
function doSomething(action, argument) {
  // argument = getThirdArgument();

  switch(action) {

  //spotify
  //================================
    case "spotify-this-song":
    let songTitle = argument;

    if(songTitle === "") {
      console.log('Error');
    } else {
      lookupSpecificSong(songTitle);
  }
    break;

    //OMDB
    //==============================
    case "movie-this":
    let movieTitle = argument;
    if(movieTitle === "") {
      getMovieInfo("Get Out");
    }else { 
      getMovieInfo(movieTitle); 
    }
    break;

    //Ticket Master
    //==================
    case "find-this-event":
    let name = argument;
    if(name === ""){
      console.log('Error');
    }else { 
      getEventInfo(name); 
    }
    break;

    //does something with text
    case "do-what-it-says":
    console.log(argument);
    break;
  }

}
const spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET,
});
doSomething(action, argument);


//This is the spotify callback and console logs



// console.log(spotify);


function lookupSpecificSong(track) {
  spotify.search({ type: 'track', query: track, limit: 1 }, function(err, data) {
    
    if(data !== undefined && data.tracks !== undefined && data.tracks.items.length === 0){
      console.log("---------------------------------------------------------------------------------")
              console.log("There was an error.  How about this song instead?")
  
              lookupSpecificSong("Jesus Walks");
    } else if (err) {
      console.log('Error occurred: ' + err);
    }else {
    console.log("The name of the album  is: " + data.tracks.items[0].artists[0].name); 
    console.log(data.tracks.items[0].name);
    console.log("The is an: " + data.tracks.items[0].album.type); 
    console.log("The link to the album is: " + data.tracks.items[0].uri);
        
    }

  });

}


//This is the ticketmaster callback and console logs 
function getEventInfo(name) {
  ticketmaster(process.env.TICKETMASTER_KEY ).discovery.v2.event.find(name)
  .then(function(result) {
  
    console.log("The event  is: " + result.items[0].name);
    console.log("The event's URL is: " + result.items[0].url);
  
  }).catch(function(err){
console.log(err);
  });
  
}


//This is the OMDB callback and console log
function getMovieInfo(movie) {
  magicKey= process.env.OMDB_ID
  axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + magicKey).then(
      function (response) {

 
          
          if (response.data.Title === undefined) {
              console.log("Error! Please enter a new movie!")
              
          } else {

              console.log("Movie Title: " + response.data.Title);
              console.log("Year Released: " + response.data.Year);
              console.log("IMDB Rating: " + response.data.imdbRating);
              console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
          }
      }).catch(function(err) {
 console.log(err);
      });
}



