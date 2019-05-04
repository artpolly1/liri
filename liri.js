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


//Controller function that determines which action is taken and what data is returned
doSomething(action, argument);


//functions
function doSomething(action, argument) {
  argument = getThirdArgument();

  switch(action) {

  //spotify
  //================================
    case "spotify-this-song":
    let songTitle = argument;
    if(songTitle === "") {
      lookupSpecificSong();
    } else { console.log('Error'); }
    break;

    //OMDB
    //==============================
    case "movie-this":
    let movieTitle = argument;
    if(movieTitle === "") {
      getMovieInfo("Get Out");
    }else { getMovieInfo(movieTitle); }
    break;

    //Ticket Master
    //==================
    case "find-this-event":
    let name = argument;
    if(name === ""){
      getEventInfo(results);
    }else { getEventInfo(name); }
    break;

    //does something with text
    case "do-what-it-says":
    doWhatItSays();
    break;
  }

}

//gets 3rd argument 
function getThirdArgument() {
 let argumentArray = process.argv;
 

  //loops through node arguments
  for ( let i = 3; i < argumentArray.length; i++) {
    let argument = argumentArray[i];
  }
   
  
  console.log(argument);
}




//This is the spotify callback and console logs

const spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET,
});

function spotifySearch(track) {
  spotify.search({ type: 'track', query: track, limit: 1 }, function(err, data) {
    
    if(data !== undefined && data.tracks !== undefined && data.tracks.items.length === 0){
      console.log("---------------------------------------------------------------------------------")
              console.log("There was an error.  How about this song instead?")
  
              spotifySearch("Jesus Walks");
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
ticketmaster(process.env.TICKETMASTER_ID ).discovery.v2.event.all()
.then(function(result) {

  console.log("The event  is: " + result.items[0].name);
  console.log("The event's URL is: " + result.items[0].url);
  
});



//This is the OMDB callback and console log
// const omdbKey= new Omdb({
//   id: process.env.OMDB_ID,
  
// });

function getMovieInfo(movieTitle) { 
  let queryUrl = `http://www.omdbapi.com/?t=" ${movieTitle} "&y=&plot=short&tomatoes=true&r=json&apikey=triloy`;
  axios.get(queryUrl).then( (response) => {   

    let movie = response.data;
    console.log( "The movie's Title is: " + movie.Title);
    console.log( "The movie was released in the year: " + movie.Year);
    console.log("The movie's rating is: " + movie.imdbRating);
    console.log("Here is the movie's plot: " + movie.Polt);

  })
    



};

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function(err, data) {
      if (err) {
        logOutput.error(err);
      } else {
  
        // Creates array with data.
        var randomArray = data.split(",");
  
        // Sets action to first item in array.
        action = randomArray[0];
  
        // Sets optional third argument to second item in array.
        argument = randomArray[1];
  
        // Calls main controller to do something based on action and argument.
        doSomething(action, argument);
      }
    });
  }
  
  // Logs data to the terminal and output to a text file.
  function logOutput(logText) {
    log.info(logText);
    console.log(logText);
  };