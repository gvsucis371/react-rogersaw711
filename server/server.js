const express = require("express");
const cors = require("cors");
const movieDB = require("./serverDB");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/movies", async (req, res) =>  {
  const movies = await movieDB.getAll();
  //We've gotta do some weird stuff with the | separation here too
  let moviesWithListValues = movies.map(movie => ({
    ...movie,
    Actors: movie.Actors.split(' | '),
    Reviews: movie.Reviews.split(' | ')
  }));
  res.json(moviesWithListValues);
});

app.post("/movies", async (req, res) => {
  const movie = req.body;
  let movieWithDelimitedLists = movie;
  movieWithDelimitedLists.Actors = movieWithDelimitedLists.Actors.join(" | ");
  movieWithDelimitedLists.Reviews = movieWithDelimitedLists.Reviews.join(" | ");
  const newMovie = await movieDB.insert(movieWithDelimitedLists);
  let movieWithFixedValues ={
    ...newMovie,
    Actors: newMovie.Actors.split(' | '),
    Reviews: newMovie.Reviews.split(' | ')
  };
  res.status(201).json(movieWithFixedValues);
});

app.put("/movies/:id", async (req, res) => {
  const id  = parseInt(req.params.id);
  const movie = req.body;
  let movieWithDelimitedLists = movie;
  movieWithDelimitedLists.Actors = movieWithDelimitedLists.Actors.join(" | ");
  movieWithDelimitedLists.Reviews = movieWithDelimitedLists.Reviews.join(" | ");
  let updatedMovie = await movieDB.update(id, movieWithDelimitedLists);
  let movieWithFixedValues ={
    ...updatedMovie,
    Actors: updatedMovie.Actors.split(' | '),
    Reviews: updatedMovie.Reviews.split(' | ')
  };
  res.json(movieWithFixedValues);
});

app.delete("/movies/:id", async (req, res) => {
  const movieId = parseInt(req.params.id);
  const result = await movieDB.deleteMovie(movieId);
  res.json(result);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
