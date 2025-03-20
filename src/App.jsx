import './App.css'
//Note: Reviews are AI generated. As they are AI generated, they may or may not be real reviews.
function App() {
  const data =[
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
  ];

function Review(props) {
    return <li> {props.name} </li>;
}

function ReviewList(props) {
    return <ul className="reviews" > {
        props.reviews.map((item, index) => (
            <Review name={item} key={index} />
        ))}
    </ul>
}

function Actors(props) {
    return <div className='actors'>
        <h3>Starring:</h3>
        <p>
        {props.actors.map((actor, index) => (`${actor}, `))}
        </p>
    </div>;
}

function Movie(props) {
    return <div>
        <h2 onClick={() => console.log(`You clicked on movie ${props.name}`)}> {props.name} </h2>
        <Actors actors={props.actors} />
        <ReviewList reviews={props.reviews} />
    </div>;
}

function Movies(data) {
  console.log(data);
    return <section>
        <div className='movies' >
          {data.map(function (movie, index){
            return <Movie key={index} name={movie.name} actors={movie.actors} reviews={movie.reviews} />
        })}
        </div>
    </section>;
}

return Movies(data)
}

export default App
