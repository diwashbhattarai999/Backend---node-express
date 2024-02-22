const getButton = document.getElementById("get-btn");
const postButton = document.getElementById("post-btn");

getButton.addEventListener("click", (e) => {
  e.preventDefault();

  fetch("http://localhost:8080/feed/posts")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error;
    });
});

postButton.addEventListener("click", (e) => {
  fetch("http://localhost:8080/feed/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "This is a post",
      content: "This is the content of the post",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error;
    });
});
