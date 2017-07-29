
var twitterKeys = require("./keys.js").twitterKeys;
var spotifyKeys = require("./keys.js").spotifyKeys;

var nodeArgs = process.argv;
var command = process.argv[2];
var songQuery = nodeArgs[3];
var movieQuery = nodeArgs[3];

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
const chalk = require('chalk');
var moment = require('moment');
var request = require('request');
var fs = require('fs');

var twitterClient = new Twitter(twitterKeys);
var spotifyClient = new Spotify(spotifyKeys);

var params = {
    screen_name: 'kjdatruf',
    count: 20
};


var commands = ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'];


const dashes = '-----------------------------------------------------';
const spaces = "    ";

var inputs = "";


for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3) {
        inputs += " " + nodeArgs[i];
    }
    else {
        inputs = nodeArgs[i];
    }
}

function instructions() {
    console.log(dashes);
    console.log("Hello. I am Liri.\n");
    console.log("Type the following into the terminal " + chalk.green("node liri.js") + " followed by one of the following commands:");
    console.log(spaces + chalk.bgBlue("my-tweets"));
    console.log(spaces + chalk.bgGreen("spotify-this-song"));
    console.log(spaces + chalk.bgRed("movie-this"));
    console.log(spaces + chalk.bgMagenta("do-what-it-says"));
    console.log(dashes);
};

instructions();

if (command == commands[0]) {
    console.log("You have selected " + chalk.bgBlue("my-tweets") + ".");
    console.log(dashes);
    myTweets();
}

if (command == commands[1]) {
    console.log("You have selected " + chalk.bgGreen("spotify-this-song") + ".");
    console.log(dashes);
    spotifyCall();
}

if (command == commands[2]) {
    console.log("You have selected " + chalk.bgRed("movie-this") + ".");
    console.log(dashes);
    movieCall();
}

if (command == commands[3]) {
    console.log("You have selected " + chalk.bgMagenta("do-what-it-says") + ".");
    console.log(dashes);
    doWhatItSays();
}


function myTweets() {
    twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var count = 0;


            console.log("Retrieving " + chalk.bold.green(tweets[0].user.screen_name) + " tweets.");
            console.log(dashes);

            setTimeout(function() {

                tweets.forEach(function(tweet) {
                    console.log("Tweet Generated On: " + moment(tweet.created_at, "ddd MMM D HH:mm:ss ZZ YYYY").format("dddd, MMMM Do YYYY, h:mm:ss a"));
                    console.log("Tweet Text: " + chalk.blue(tweet.text));
                    console.log("Number of Times Favorited: " + tweet.favorite_count);
                    console.log(dashes);
                    count++;
                });
            }, 1500);
            
            setTimeout(function() {
                console.log(chalk.bgRed("Tweets data retrieval has been completed."));
                console.log(chalk.bold(count + " tweets were retrieved."));
                console.log(dashes);
            }, 3000);
        };
    });
};


function spotifyCall() {
    var count = 0;

    if (inputs == "" && nodeArgs[2] == commands[1]) {
        spotifyClient.search({
            type: 'track',
            query: 'The Sign Ace of Base',
            limit: 1 
            },
            function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log(chalk.red("You did not select a specific song. Displaying the spotify default song."));
                console.log(dashes);
                console.log(chalk.bold("Name of Track: ") + data.tracks.items[0].name); 
                console.log(chalk.bold("Artist(s): ") + data.tracks.items[0].artists[0].name);
                console.log(chalk.bold("Song Album: ") + data.tracks.items[0].album.name);
                console.log(chalk.bold("Preview link: ") + data.tracks.items[0].external_urls.spotify);

                setTimeout(function() {
                    console.log(dashes);
                    console.log(chalk.bgRed("Spotify data retrieval has been completed."));
                    console.log(dashes);
                }, 1000);
            }
        );
    }
    else {
        spotifyClient.search({
            type: 'track',
            query: songQuery,
            },
            function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                for (var i = 0; i < (data.tracks.items).length; i++) {
                    console.log(chalk.bold("Name of Track: ") + data.tracks.items[i].name); 
                    console.log(chalk.bold("Artist(s): ") + data.tracks.items[i].artists[0].name);
                    console.log(chalk.bold("Song Album: ") + data.tracks.items[i].album.name);
                    console.log(chalk.bold("Preview link: ") + data.tracks.items[i].external_urls.spotify);
                    console.log(dashes);
                    count++;
                }

                setTimeout(function() {
                    console.log(chalk.bgRed("Spotify data retrieval has been completed."));
                    console.log(chalk.bold(count + " song entries were retrieved."));
                    console.log(dashes);
                }, 3000);
            }
        );
    }
};


function movieCall() {
    if (inputs == "" && nodeArgs[2] == commands[2]) {
        request('http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=40e9cece', function (error, response, body) {
            const movieInfo = JSON.parse(body);
            var rottenTomatoesRating = 'Not Rated';

            if (error) {
                console.log('error:', error);
            }

            console.log(chalk.red("You did not select a specific movie. Displaying OMDB default movie."));
            console.log(dashes);
            console.log(chalk.bold("Movie Title: ") + movieInfo.Title);
            console.log(chalk.bold("Released Year: ") + movieInfo.Released);
            console.log(chalk.bold("IMDB Rating: ") + movieInfo.imdbRating);
            for (var i = 0; i < movieInfo.Ratings.length; i++) {
                if (movieInfo.Ratings[i].Source == 'Rotten Tomatoes') {
                    rottenTomatoesRating = movieInfo.Ratings[i].Value;
                }
            }
            console.log(chalk.bold("Rotten Tomatoes Rating: ") + rottenTomatoesRating);
            console.log(chalk.bold("Starring Actors: ") + movieInfo.Actors);
            console.log(chalk.bold("Country Produced: ") + movieInfo.Country);
            console.log(chalk.bold("Movie Language: ") + movieInfo.Language);
            console.log(chalk.bold("Movie Plot: ") + movieInfo.Plot);
            console.log(dashes);

            setTimeout(function() {
                console.log(chalk.bgRed("OMDB data retrieval has been completed."));
                console.log(dashes);
            }, 1000);
        });
    }
    else {
        var movieInput = movieQuery.replace(/ /g, '+');
        request('http://www.omdbapi.com/?t=' + movieInput + '&y=&plot=short&apikey=40e9cece', function (error, response, body) {
            const movieInfo = JSON.parse(body);
            var rottenTomatoesRating = 'Not Rated';

            if (error) {
                console.log('error:', error);
            }

            console.log(chalk.bold("Movie Title: ") + movieInfo.Title);
            console.log(chalk.bold("Released Year: ") + movieInfo.Released);
            console.log(chalk.bold("IMDB Rating: ") + movieInfo.imdbRating);
            for (var i = 0; i < movieInfo.Ratings.length; i++) {
                if (movieInfo.Ratings[i].Source == 'Rotten Tomatoes') {
                    rottenTomatoesRating = movieInfo.Ratings[i].Value;
                }
            }
            console.log(chalk.bold("Rotten Tomatoes Rating: ") + rottenTomatoesRating);
            console.log(chalk.bold("Starring Actors: ") + movieInfo.Actors);
            console.log(chalk.bold("Country Produced: ") + movieInfo.Country);
            console.log(chalk.bold("Movie Language: ") + movieInfo.Language);
            console.log(chalk.bold("Movie Plot: ") + movieInfo.Plot);
            console.log(dashes);

            setTimeout(function() {
                console.log(chalk.bgRed("OMDB data retrieval has been completed."));
                console.log(dashes);
            }, 1000);
        });
    }
}


function doWhatItSays() {
    fs.readFile("random.txt", 'utf-8', function(error, data) {
        if (error) {
            return console.log(error);
        }

        var textInput = data.split(',');
        var commandInput = textInput[0];
        var queryInput = textInput[1];

        if (commandInput == commands[0]) {
            myTweets();
        }

        if (commandInput == commands[1]) {
            songQuery = queryInput;
            spotifyCall();
        }

        if (commandInput == commands[2]) {
            movieQuery = queryInput;
            movieCall();
        }
    })
}