const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const util = require('util');
const app = express();
const router = express.Router();
const spotifyApi = new SpotifyWebApi({
  clientId: '',
  clientSecret: ''
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/user', (req, res) => {
	global.userData;
	global.playlistData;
	global.totalData = [];
	let token = "q34hz9w6r3i1jhxrn5kxk0dyp";

	spotifyApi.clientCredentialsGrant()
		.then((playlist) => {
		    spotifyApi.setAccessToken(playlist.body['access_token']);
		    return spotifyApi.getUserPlaylists(token);
		 })
		.then((playlist) => {
			global.playlistData = playlist.body;
		  })
		  .catch((err) => {
		    console.log(err);
		  });

	spotifyApi.clientCredentialsGrant()
		.then((user) => {
		    spotifyApi.setAccessToken(user.body['access_token']);
		    return spotifyApi.getUser(token);
		 })
		.then((user) => {
			global.userData = user.body;
		  })
		  .catch((err) => {
		    console.log(err);
		  });
	res.render('user', {playlist: playlistData, user: userData});
});

app.get('/playlist/:id', (req, res, next) => {
  spotifyApi.clientCredentialsGrant()
		.then((data) => {
		    spotifyApi.setAccessToken(data.body['access_token']);
		    return spotifyApi.getPlaylist(req.params.id);
		 })
		.then((data) => {
			res.render('playlist', {data: data.body});
		  })
		  .catch((err) => {
		    console.log(err);
		  });
})

app.listen(5000);
