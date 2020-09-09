const express = require("express");
const Posts = require("./data/db");


const router = express.Router();

router.post("/", (req, res) => {
    const newPost = req.body;
    try {
        if (!newPost.title || !newPost.contents) {
            res
                .status(400)
                .json({ message: "Please provide title and contents for the post." });
        } else {
            Posts.insert(newPost);
            res.status(201).json(newPost);
        }
    } catch {
        res.status(500).json({
            message: "There was an error while saving the post to the database.",
        });
    }
});

router.post("/:id/comments", async (req, res) => {
    const id = req.params.id;
    const newComment = req.body;
    try {
        if (!newComment.text) {
            res.status(400).json({ message: "Please provide text for the comment." });
        } else {
            let foundPost = await Posts.findById(id);
            if (foundPost.length !== 0) {
                Posts.insertComment(newComment);
                res.status(201).json(newComment);
            } else {
                res.status(404).json({ message: "There is no post with that ID." });
            }
        }
    } catch {
        res.status(500).json({
            message: "There was an error while saving the comment to the database.",
        });
    }
});

router.get("/", async (req, res) => {
    try {
        let allPosts = await Posts.find();
        res.status(200).json(allPosts);
    } catch {
        res
            .status(500)
            .json({ message: "The posts information could not be retrieved." });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const selected = await Posts.findById(id);
    try {
        if (selected.length !== 0) {
            res.json(selected);
        } else {
            res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." });
        }
    } catch {
        res
            .status(500)
            .json({ message: "The post information could not be retrieved." });
    }
});

router.get("/:id/comments", async (req, res) => {
    const id = req.params.id;
    const postComments = await Posts.findPostComments(id);
    try {
        if (postComments.length !== 0) {
            res.json(postComments);
        } else {
            res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." });
        }
    } catch {
        res.status(500).json({
            message: "The comments information could not be retrieved.",
        });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const deleted = await Posts.findById(id);
    try {
        if (deleted.length !== 0) {
            await Posts.remove(id);
            res.json(deleted);
        } else {
            res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." });
        }
    } catch {
        res
            .status(500)
            .json({ message: "The post information could not be retrieved." });
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    try {
        if (!changes.title || !changes.contents) {
            res
                .status(400)
                .json({ message: "Please provide title and contents for the post." });
        } else {
            let found = await Posts.findById(id);
            if (found.length !== 0) {
                await Posts.update(id, changes);
                let edited = await Posts.findById(id);
                res.status(200).json(edited);
            } else {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." });
            }
        }
    } catch {
        res
            .status(500)
            .json({ message: "The post information could not be modified." });
    }
});

module.exports = router;
