const express = require('express')
const movies = require("./dataFile.json");

const app = express()
const port = 3000
const titles = Object.keys(movies)


app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  if (err.code) {
    return res.status(curlerr.code).json({ code: 404, msg: err.message })
  }
  return res.status(500).json({ code: 500, msg: err.message })
})

function getMovie(req, res) {
  const title = req.params.title
  const movie = movies[title];
  const pretty = req.query.pretty;
  if (movie == null) {
    let err = new Error("Movie not found!");
    err.code = 404;
    throw err;
  }
  return { movie, pretty };
}

function sendData(res, data, pretty) {
  res.header("Content-Type", 'application/json');
  const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
  res.send(json);
}

app.get('/', (req, res) => res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <title>Movie API</title>
</head>
<body class="container">
  <br/>
  <h2>Simple test server for the fall 2019 exam</h2>
  <br/>
  <p><a href="/allTitles?pretty=1">List of all titles you can search for </a></p>
  
  <h3>This simulates the external server-API's you must use for the exercise</h3>
  <p><i>While testing via a browser (and only here), you can add this to the end of the URL to get pretier output: <code>?pretty=1</code></i></p>
 
  
  <table class="table">
  <thead>
  <tr><th>API - URL</th><th>Description</th><th>Test</th></tr>
  </thead>
   <tbody>
    <tr><td>movieInfo/:title</td><td>Get details for a movie - given the title</td><td><a href="movieInfo/The Nutty Professor">The Nutty Professor</a></td></tr>
    <tr><td>moviePoster/:title</td><td>Get movie Poster - given the title - given the title</td><td><a href="moviePoster/The Nutty Professor">The Nutty Professor</a></td></tr>
    <tr><td>imdbScore/:title</td><td>Get imdb scores - given the title - given the title</td><td><a href="imdbScore/The Nutty Professor">The Nutty Professor</a></td></tr>
    <tr><td>tomatoesScore/:title</td><td>Get tomatoes scores - given the title - given the title</td><td><a href="tomatoesScore/The Nutty Professor">The Nutty Professor</a></td></tr>
    <tr><td>metacriticScore/:title</td><td>Get metacritic scores - given the title</td><td><a href="metacriticScore/The Nutty Professor">The Nutty Professor</a></td></tr>
    <tbody>
  <table>
  
</body>
</html>
`))

app.get("/allTitles", (req, res) => {
  const pretty = req.query.pretty;
  sendData(res, titles, pretty)
}
);

app.get("/movieInfo/:title", (req, res, next) => {
  const { movie, pretty } = getMovie(req, res)
  const data = {
    title: movie.title, year: movie.year,
    plot: movie.plot || "",
    directors: movie.directors ? movie.directors.join(",") : "",
    genres: movie.genres ? movie.genres.join(",") : "",
    cast: movie.cast ? movie.cast.join(",") : ""
  }
  return sendData(res, data, pretty);
})

app.get("/moviePoster/:title", (req, res, next) => {
  const { movie, pretty } = getMovie(req, res)
  const data = { title: movie.title, poster: movie.poster };
  return sendData(res, data, pretty);
})

app.get("/imdbScore/:title", (req, res, next) => {
  const { movie, pretty } = getMovie(req, res)
  const data = {
    title: movie.title, source: "imdb",
    imdbRating: movie.imdb.rating || -1,
    imdbVotes: movie.imdb.votes || -1
  }
  return sendData(res, data, pretty);
})

app.get("/tomatoesScore/:title", (req, res, next) => {
  const { movie, pretty } = getMovie(req, res)
  const data = {
    title: movie.title, source: "tomatoes",
    viewer: movie.tomatoes.viewer, critic: movie.tomatoes.critic
  }
  return sendData(res, data, pretty);
})
app.get("/metacriticScore/:title", (req, res, next) => {
  const { movie, pretty } = getMovie(req, res)
  const data = { title: movie.title, source: "metacritic", metacritic: movie.metacritic }
  return sendData(res, data, pretty);
})

app.use(function (req, res, next) {
  res.status(404);
  res.json({ code: 404, msg: "No matching route found" })
})



app.listen(port, () => console.log(`Exam Server (movies), listening on port ${port}!`))