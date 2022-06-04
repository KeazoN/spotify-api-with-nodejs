
# Spotify Playlist API with NodeJS

It is made to show anyone's Spotify playlist in any web application.

## How can use

#### Firstly
 Libraries must be loaded
```bash
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
let token = "id";
//https://open.spotify.com/user/id You can get id from
```
* Definitely information to be fill.

  
## ScreenShot

![Screenshot](https://i.hizliresim.com/dvqtu6e.jpg)
![Screenshot](https://i.hizliresim.com/8rmng3b.jpg)

  ## Contribution

Contributions are always welcome!

Getting started See `app.js'.


Please follow the 'code of conduct' of this project.
## Feedback

If you have any feedback, please contact us at ugurmercan38@gmail.com.

  
![Logo](https://i.hizliresim.com/k7ebs59.png)



# Updates

- A new page has arrived. (user.ejs)
- By putting the user ID in the variable named Token, you will be able to access all the playlists and information of the user from the "user.ejs" page.
- When any of the playlists is clicked, you will be able to get the ID parameter from the "playlist.ejs" page and get information about that playlist.


    
