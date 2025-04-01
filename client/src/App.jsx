import React, { useState, useEffect } from "react";
import "./App.css";

function Review({ name }) {
  return <li>{name}</li>;
}

function ReviewList({ reviews }) {
  return (
    <ul className="reviews">
      {reviews.map((review, index) => (
        <Review name={review} key={index} />
      ))}
    </ul>
  );
}

function Actors({ actors }) {
  //This time around I realized we can .join() instead of having that ugly trailing comma
  return (
    <div className="actors">
      <h3>Starring:</h3>
      <p>{actors.join(", ")}</p>
    </div>
  );
}

function Movie({ name, actors, reviews, onDelete, onEdit }) {
  return (
    <div>
      <h2>{name}</h2>
      <Actors actors={actors} />
      <ReviewList reviews={reviews} />
      <button onClick={onDelete}>Delete</button>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

function Movies() {
  let [movies, setMovies] = useState([]);
  let [newMovie, setNewMovie] = useState({ Id: 0, Name: "", Actors: "", Reviews: "" });
  let [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  //If they're editing we've gotta populate the field up top like demonstrated in class
  //There's a big issue that I didn't see coming with the lists of elements. As a stopgap we can just split with " | "
  // This means we have to map those when populating the list too and when parsing out what they put in
  const handleAddMovie = () => {
    if (newMovie.Name && newMovie.Actors && newMovie.Reviews) {
      //Move movieData outside because I really was just doing the same exact thing twice before
      const movieData = {
        Id: editingIndex !== null ? newMovie.Id : null,
        Name: newMovie.Name,
        Actors: newMovie.Actors.split(" | "),
        Reviews: newMovie.Reviews.split(" | ")
      };

      if (editingIndex !== null) {
        fetch(`http://localhost:5000/movies/${movieData.Id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movieData)
        })
        .then((res) => res.json())
        .then((updatedMovie) => {
            setMovies(movies.map((movie) => (movie.Id === updatedMovie.Id ? updatedMovie : movie)));
            setEditingIndex(null);
          });
      } else {
        fetch("http://localhost:5000/movies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movieData)
        })
          .then((res) => res.json())
          .then((newMovie) => {
            setMovies([...movies, newMovie])
          });
      }
      setNewMovie({ Name: "", Actors: "", Reviews: "" });
    }
  };

  const handleDeleteMovie = (movieId) => {
    fetch(`http://localhost:5000/movies/${movieId}`, { method: "DELETE" })
      .then(() => {
        setMovies(movies.filter((movie) => movie.Id !== movieId));
      })
  };

  const handleEditMovie = (index) => {
    const movie = movies[index];
    setNewMovie({
      Id: movie.Id,
      Name: movie.Name,
      Actors: movie.Actors.join(" | "),
      Reviews: movie.Reviews.join(" | ")
    });
    setEditingIndex(index);
  };

  //Use the model shown in class where you swap the add form to an edit form on button click (The color2 example)
  return (
    <section>
      <div className="add-movie-form">
        <h2>{editingIndex !== null ? "Edit Movie" : "Add a New Movie"}</h2>
        <em>Separate list values with " | "</em>
        <br />
        <input
          type="text"
          placeholder="Movie Name"
          value={newMovie.Name}
          onChange={(e) => setNewMovie({ ...newMovie, Name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Actors"
          value={newMovie.Actors}
          onChange={(e) => setNewMovie({ ...newMovie, Actors: e.target.value })}
        />
        <input
          type="text"
          placeholder="Reviews"
          value={newMovie.Reviews}
          onChange={(e) => setNewMovie({ ...newMovie, Reviews: e.target.value })}
        />
        <button onClick={handleAddMovie}>{editingIndex !== null ? "Update Movie" : "Add Movie"}</button>
      </div>
      <div className="movies">
        {movies.map((movie, index) => (
          <Movie
            key={index}
            name={movie.Name}
            actors={movie.Actors}
            reviews={movie.Reviews}
            onDelete={() => handleDeleteMovie(movie.Id)}
            onEdit={() => handleEditMovie(index)}
          />
        ))}
      </div>
    </section>
  );
}

function App() {
  return <Movies />;
}

export default App;