const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const util = require('util');
const app = express();
const spotifyApi = new SpotifyWebApi({
  clientId: 'clientId',
  clientSecret: 'clientSecret'
  //https://developer.spotify.com You can get informations from
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	spotifyApi.clientCredentialsGrant()
		.then((data) => {
		    spotifyApi.setAccessToken(data.body['access_token']);
		    return spotifyApi.getPlaylist('id');
		    //https://open.spotify.com/playlist/id You can get id from
		 })
		.then((data) => {
			res.render('index', {data: data.body});
			//console.log(util.inspect(data.body.tracks.items[1].track, false, null, true));
			//console.log(util.inspect(data.body, false, null, true));
		  })
		  .catch((err) => {
		    console.log(err);
		  });
});

app.listen(5000);