const Spotify = require('node-spotify-api');
    
    
    
    let spotify = new Spotify({
      id: process.env.SPOTIFY_ID,
      secret: process.env.SPOTIFY_SECRET,
    });
    
    spotify.search({ type: 'track', query: songTitle}, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
  
    console.log("The name of the album  is: " + data.tracks.items[0].album.name); 
    console.log("The is an: " + data.tracks.items[0].album.type); 
    console.log("The link to the album is: " + data.tracks.items[0].uri);
    
    });
    
  
  