exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "First Post", content: "This is a first post" }],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  //TODO: Create post in database

  // 200: Success
  // 201: Successfully created a resource

  res.status(201).json({
    message: "Post created successfully",
    post: {
      id: new Date().toISOString(),
      title,
      content,
    },
  });
};
