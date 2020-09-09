const express = require("express");
const postsRouter = require("./posts-router");

const server = express();


server.use(express.json());

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
    res.json({
        message: "This thing is working",
    });
});

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
