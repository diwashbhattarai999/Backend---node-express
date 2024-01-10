import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((res) => setJokes(res.data))
      .catch((err) => console.log(err));
  }, []);
  console.log(jokes);

  return (
    <>
      <h1>Backend with express</h1>
      <p>JOKES: {jokes.length}</p>
      {jokes &&
        jokes.map((joke, index) => (
          <div key={joke.id}>
            <h3>
              {index + 1}. {joke.question}
            </h3>
            <p>
              {"->"} {joke.answer}
            </p>
          </div>
        ))}
    </>
  );
}

export default App;
