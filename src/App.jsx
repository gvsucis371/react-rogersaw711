import React, { useState } from "react";
import "./App.css";

function Review({ name }) {
  return <li>{name}</li>;
}

function ReviewList({ reviews }) {
  return (
    <ul class="reviews">
      {reviews.map((review, index) => (
        <Review name={review} key={index} />
      ))}
    </ul>
  );
}

function Actors({ actors }) {
  //This time around I realized we can .join() instead of having that ugly trailing comma
  return (
    <div class="actors">
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
  const [movies, setMovies] = useState([
    {
      name: "Ratatouille",
      actors: ["Patton Oswalt", "Ian Holm", "Lou Romano", "Brian Dennehy"],
      reviews: [
        "A delightful and heartwarming film about passion and perseverance.",
        "Pixar at its finest, with beautiful animation and a charming story.",
        "Remy is one of the most lovable characters in animation history."
      ]
    },
    {
      name: "Inglourious Basterds",
      actors: ["Brad Pitt", "Christoph Waltz", "Diane Kruger", "Mélanie Laurent"],
      reviews: [
        "Quentin Tarantino delivers another masterpiece of storytelling.",
        "Christoph Waltz steals the show with an unforgettable performance.",
        "A unique and thrilling take on World War II cinema."
      ]
    },
    {
      name: "Lord of The Rings: The Two Towers",
      actors: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen", "Orlando Bloom"],
      reviews: [
        "One of the greatest fantasy films ever made.",
        "Epic battles, stunning visuals, and unforgettable characters.",
        "Gollum's character development is truly groundbreaking."
      ]
    }
  ]);

  const [newMovie, setNewMovie] = useState({ name: "", actors: "", reviews: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  //If they're editing we've gotta populate the field up top like demonstrated in class
  //There's a big issue that I didn't see coming with the lists of elements. As a stopgap we can just split with " | "
  // This means we have to map those when populating the list too and when parsing out what they put in
  const handleAddMovie = () => {
    if (newMovie.name && newMovie.actors && newMovie.reviews) {
      if (editingIndex !== null) {
        const updatedMovies = [...movies];
        updatedMovies[editingIndex] = {
          name: newMovie.name,
          actors: newMovie.actors.split(" | "),
          reviews: newMovie.reviews.split(" | ")
        };
        setMovies(updatedMovies);
        setEditingIndex(null);
      } else {
        setMovies([...movies, {
          name: newMovie.name,
          actors: newMovie.actors.split(" | "),
          reviews: newMovie.reviews.split(" | ")
        }]);
      }
      setNewMovie({ name: "", actors: "", reviews: "" });
    }
  };

  const handleDeleteMovie = (index) => {
    setMovies(movies.filter((_, i) => i !== index));
  };

  const handleEditMovie = (index) => {
    const movie = movies[index];
    setNewMovie({
      name: movie.name,
      actors: movie.actors.join(" | "),
      reviews: movie.reviews.join(" | ")
    });
    setEditingIndex(index);
  };

  //Use the model shown in class where you swap the add form to an edit form on button click (The color2 example)
  return (
    <section>
      <div class="add-movie-form">
        <h2>{editingIndex !== null ? "Edit Movie" : "Add a New Movie"}</h2>
        <em>Separate list values with " | "</em>
        <br />
        <input
          type="text"
          placeholder="Movie Name"
          value={newMovie.name}
          onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Actors"
          value={newMovie.actors}
          onChange={(e) => setNewMovie({ ...newMovie, actors: e.target.value })}
        />
        <input
          type="text"
          placeholder="Reviews"
          value={newMovie.reviews}
          onChange={(e) => setNewMovie({ ...newMovie, reviews: e.target.value })}
        />
        <button onClick={handleAddMovie}>{editingIndex !== null ? "Update Movie" : "Add Movie"}</button>
      </div>
      <div class="movies">
        {movies.map((movie, index) => (
          <Movie
            key={index}
            name={movie.name}
            actors={movie.actors}
            reviews={movie.reviews}
            onDelete={() => handleDeleteMovie(index)}
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