//imports
const router = require("express").Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/authentication');
const sequelize = require('../../config/connection');

//get all posts (GET)
router.get("/", (req, res) => {
    Post.findAll({
        attributes: ["id", "post_text", "title"],
        include: [{
            model: Comment,
            attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
            include: {
                model: User,
                attributes: ["username"]
            }
        },
        {
            model: User,
            attributes: ["username"]
        },
        ]
    }).then(data => res.json(data)).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});
//get one post by id (GET)
router.get("/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ["id", "post_text", "title"],
        include: [{
            model: User,
            attributes: ["username"]
        },
        {
            model: Comment,
            attributes: ["id", "comment_text", "post_id", "user_id"],
            include: {
                model: User,
                attributes: ["username"]
            }
        }
        ]
    }).then(data => {
        if (!data) {//if there is no data, return appropriate err msg
            res.status(404).json({ message: "There is no post with this id" });
            return;
        }

        res.json(data);

    }).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});

//create new post (POST)
router.post("/", withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_text: req.body.post_text,
        user_id: req.session.user_id
    }).then(data => res.json(data)).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});

//update a post by id (PUT)
router.put("/:id", withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        post_text: req.body.post_text
    },
    {
        where: {
           id: req.params.id
        }
    }).then(data => {
        if (!data) {//if there is no data, return appropriate err msg
            res.status(404).json({ message: "There is no post with this id" });
            return;
        }

        res.json(data);

    }).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});

//delete a post by id (DELETE)
router.delete("/:id", withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(data => {
        if (!data) {//if there is no data, return appropriate err msg
            res.status(404).json({ message: "There is no post with this id" });
            return;
        }

        res.json(data);

    }).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});

module.exports = router;