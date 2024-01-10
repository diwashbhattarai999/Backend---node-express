import express from "express";
import "dotenv/config";

const app = express();
// app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.send("Server is ready!");
});

app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      question: "Why did the scarecrow win an award?",
      answer: "Because he was outstanding in his field!",
    },
    {
      id: 2,
      question: "How do you organize a space party?",
      answer: "You planet!",
    },
    {
      id: 3,
      question: "What do you call fake spaghetti?",
      answer: "An impasta!",
    },
    {
      id: 4,
      question: "Why did the bicycle fall over?",
      answer: "Because it was two-tired!",
    },
    {
      id: 5,
      question: "What's orange and sounds like a parrot?",
      answer: "A carrot!",
    },
    {
      id: 6,
      question: "What's brown and sticky?",
      answer: "A stick!",
    },
    {
      id: 7,
      question: "Why did the math book look sad?",
      answer: "Because it had too many problems!",
    },
    {
      id: 8,
      question: "What do you call a fish with no eyes?",
      answer: "Fsh!",
    },
    {
      id: 9,
      question: "Why did the tomato turn red?",
      answer: "Because it saw the salad dressing!",
    },
    {
      id: 10,
      question: "How does a penguin build its house?",
      answer: "Igloos it together!",
    },
  ];
  res.send(jokes);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serve at http://localhost: ${port}`);
});
