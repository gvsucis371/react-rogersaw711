var sqlite3 = require('sqlite3').verbose();
let path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'movie.db'));

const initializeDatabase = () => {
    
    db.serialize(() => {
        //Stack overflow for IF NOT EXISTS: https://stackoverflow.com/a/4098026
        db.run(`CREATE TABLE IF NOT EXISTS Movie (Id INTEGER PRIMARY KEY, Name TEXT NOT NULL, Actors TEXT NOT NULL, Reviews TEXT NOT NULL)`);
        //Only create the default values if there aren't any values in there already
        db.get("SELECT COUNT (*) AS Count FROM Movie", (err, row) =>{
            console.log(row);
            if (row.Count > 0) { return; }
            db.run(`INSERT INTO Movie (name, actors, reviews) VALUES (\"Ratatouille\", \"Patton Oswalt | Ian Holm | Lou Romano | Brian Dennehy\", \"A delightful and heartwarming film about passion and perseverance. | Pixar at its finest, with beautiful animation and a charming story. | Remy is one of the most lovable characters in animation history.\")`);
            db.run(`INSERT INTO Movie (name, actors, reviews) VALUES ("Inglourious Basterds", "Brad Pitt | Christoph Waltz | Diane Kruger | Mélanie Laurent", "Quentin Tarantino delivers another masterpiece of storytelling. | Christoph Waltz steals the show with an unforgettable performance. | A unique and thrilling take on World War II cinema.")`);
            db.run(`INSERT INTO Movie (name, actors, reviews) VALUES ("Lord of The Rings: The Two Towers", "Elijah Wood | Ian McKellen | Viggo Mortensen | Orlando Bloom", "One of the greatest fantasy films ever made. | Epic battles, stunning visuals, and unforgettable characters. | Gollum's character development is truly groundbreaking.")`);
        });
    });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Movie', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const get = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Movie WHERE Id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const insert = (movie) => {
    const errors = validateMovie(movie);
    if (errors.length > 0) {
        console.error("Failed validation:", errors);
        return;
    }

    return new Promise((resolve, reject) => {
        const { Name, Actors, Reviews } = movie;
        db.run(
            'INSERT INTO Movie (Name, Actors, Reviews) VALUES (?, ?, ?)', [Name, Actors, Reviews],
            function(_err, _data) {
                movie.Id = this.lastID;
                resolve(movie);
            }
        );
    });
};

const update = (id, movie) => {
    const errors = validateMovie(movie);
    if (errors.length > 0) {
        console.error("Failed validation:", errors);
        return;
    }

    if (errors.any)
    return new Promise((resolve, reject) => {
        const { Id, Name, Actors, Reviews } = movie;
        db.run(`UPDATE Movie SET Name = ?, Actors = ?, Reviews = ? WHERE Id = ?`, [Name, Actors, Reviews, Id],
            function(_err, _data){
                resolve(movie);
            }
        );
    });
};

//For some reason delete is a reserved word
const deleteMovie = (id) => {
    db.run(`DELETE FROM Movie WHERE Id = ${id}`);
};

const validateMovie = (movie) =>{
    let errors = [];

    if (!movie.Name || movie.Name.trim().length === 0) {
        errors.push("Movie must have a name");
    } else if (movie.Name.length > 100) {
        errors.push("Movie must have a title less than 100 characters long");
    }

    if (movie.Actors.length === 0) {
        errors.push("Movie must have at least one actor.");
    } else {
        movie.Actors.forEach((actor, index) => {
            if (typeof actor !== "string" || actor.trim().length === 0) {
                errors.push(`Actor at position ${index + 1} must be a non-empty string.`);
            }
        });
    }

    if (movie.Reviews) {
        movie.Reviews.forEach((review, index) => {
            if (!review || review.trim().length === 0) {
                errors.push('Review must have a description');
                return;
            }
        });
    }

    return errors;
};

initializeDatabase();

module.exports = {
  getAll,
  get,
  insert,
  update,
  deleteMovie
};
