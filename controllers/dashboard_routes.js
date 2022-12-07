//imports
const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/authentication");
const sequelize = require("../config/connection");

//rendering all posts by all logged in users (GET)
router.get("/", withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ["id", "post_text", "title"],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    }).then(data => {
        const posts = data.map(post => post.get({ plain: true }));
        res.render("dashboard", { posts, loggedIn: true });
    }).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});

//rendering edit post page by id (GET)
router.get("/edit/:id", withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ["id", "post_text", "title"],
        include: [
            {
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
        const post = data.get({ plain: true });
        res.render("edit-posts", { post, loggedIn: true });
    }).catch(err => {//default err msg
        console.log(err);
        res.status(500).json(err);
    });
});

//rendering create new post page (GET)
router.get("/newpost", (req, res) => {
    res.render("new-posts");
});

module.exports = router;