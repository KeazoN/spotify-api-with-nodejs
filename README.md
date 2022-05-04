
# Spotify Playlist API with NodeJS

It is made to show anyone's Spotify playlist in any web application.

## How can use

#### Firstly
 Libraries must be loaded
```javascript
    npm install
```

#### Secondly
```javascript
const spotifyApi = new SpotifyWebApi({
  clientId: 'CliendID',
  clientSecret: 'ClientSecret'
  //https://developer.spotify.com You can get informations from
});
```
#### Finally

```javascript
return spotifyApi.getPlaylist('id');
//https://open.spotify.com/playlist/id You can get id from
```
* Definitely information to be fill.

  
## ScreenShot

![Screenshot](https://i.hizliresim.com/lx47lgn.jpg)

  ## Contribution

Contributions are always welcome!

Getting started See `app.js'.

Please follow the 'code of conduct' of this project.
## Feedback

If you have any feedback, please contact us at ugurmercan38@gmail.com.

  
![Logo](https://i.hizliresim.com/j0sz4cf.png)

    