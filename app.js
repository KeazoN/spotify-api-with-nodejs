const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const fetch = require('node-fetch');
const { extractColors } = require('extract-colors');
const tinycolor = require('tinycolor2');
const bodyParser = require('body-parser');
const app = express();
const { client_id, client_secret, redirect_uri } = require('./tokens')
const spotifyApi = new SpotifyWebApi({
	clientId: client_id,
	clientSecret: client_secret,
	redirectUri: redirect_uri
});
app.use(bodyParser.urlencoded({ extended: true }));
const scopes = [
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'user-read-email',
	'user-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-read-private',
	'playlist-modify-private',
	'user-library-modify',
	'user-library-read',
	'user-top-read',
	'user-read-playback-position',
	'user-read-recently-played',
	'user-follow-read',
	'user-follow-modify'
];

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/login', (req, res) => {
	res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
	const error = req.query.error;
	const code = req.query.code;

	if (error) {
		console.error('Callback Error:', error);
		res.send(`Callback Error: ${error}`);
		return;
	}
	spotifyApi
		.authorizationCodeGrant(code)
		.then(data => {
			const access_token = data.body['access_token'];
			const refresh_token = data.body['refresh_token'];
			const expires_in = data.body['expires_in'];
			spotifyApi.setAccessToken(access_token);
			spotifyApi.setRefreshToken(refresh_token);

			res.redirect("/me");

			setInterval(async () => {
				const data = await spotifyApi.refreshAccessToken();
				const access_token = data.body['access_token'];
				spotifyApi.setAccessToken(access_token);
			}, expires_in / 2 * 1000);
		})
		.catch(error => {
			console.error('Error getting Tokens:', error);
			res.send(`Error getting Tokens: ${error}`);
		});
});

async function getAccessToken() {
	await fetch("https://open.spotify.com/get_access_token").then(async res => {
		let tokenGet = await res.json();
		spotifyApi.setAccessToken(tokenGet.accessToken)
	})
	return;
}

async function getPlaylistTracks(
	playlistid,
	options,
) {
	let offset = options.offset;
	let pagesize = options.pagesize;
	let continueloop = true;
	let pages = [];
	let i = 0;
	let result = await spotifyApi
		.getPlaylistTracks(playlistid, {
			offset: 0,
			limit: pagesize,
		})
		.then((x) => x.body);
	result.items.map((x) => pages.push(x));
	do {
		try {
			if (result.next !== null) {
				offset = offset + pagesize;
				i = i + 1;
				result = await spotifyApi
					.getPlaylistTracks(playlistid, {
						offset: offset,
					})
					.then((x) => x.body);
				result.items.map((x) => pages.push(x));
			} else {
				continueloop = false;
			}
		} catch (e) {
			continueloop = false;
		}
	} while (continueloop);
	return pages;
}

async function getPlaylist(playlist) {
	let continueloop = true;
	let data;
	do {
		try {
			data = await spotifyApi
				.getPlaylist(playlist)
				.then((x) => x.body);
			if (data) {
				continueloop = false;
			}
		} catch (e) {
			continueloop = false;
		}
	} while (continueloop);
	return data;
}

app.get('/me', async (req, res) => {
	let userDataFunc = await spotifyApi.getMe();
	let userListening = await spotifyApi.getMyCurrentPlayingTrack();
	let userPlaylistFunc = await spotifyApi.getUserPlaylists(userDataFunc.body.id)
	userPlaylistFunc.body.items = userPlaylistFunc.body.items.filter(x => x.tracks.total > 0);
	const color = userListening.body.item.album.images[0].url;
	extractColors(color).then((colorHex) => {
		res.render('user', { playlist: userPlaylistFunc.body, user: userDataFunc.body, listen: userListening.body, color: colorHex, logoColor: tinycolor(colorHex[0].hex).isDark() ? "#FFFFFF" : "#000000" });
	});
});

app.get('/user/:id', async (req, res) => {
	global.totalData = [];
	let userDataFunc = await spotifyApi.getUser(req.params.id);
	let userPlaylistFunc = await spotifyApi.getUserPlaylists(userDataFunc.body.id)
	userPlaylistFunc.body.items = userPlaylistFunc.body.items.filter(x => x.tracks.total > 0);

	res.render('user', { playlist: userPlaylistFunc.body, user: userDataFunc.body, listen: totalData });
});

app.get('/playlist/:id', async (req, res, next) => {
	await getPlaylist(req.params.id)
		.then(async (data) => {
			res.render('playlist', { data: data, songs: await getPlaylistTracks(data.id, { offset: 0, pagesize: 100 }) });
		})
		.catch((err) => {
			console.log(err);
		});
})

app.listen(5000);
