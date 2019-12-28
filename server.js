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
    return res.status(err.code).json({ code: 404, msg: err.message })
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

app.get('/', (req, res) => res.send('Simple REST-movie Server meant for an exam-exercise'))

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