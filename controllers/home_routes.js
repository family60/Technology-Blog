//imports
const { User, Post, Comment } = require("../models");
const router = require("express").Router();
const sequelize = require("../config/connection");

//getting all posts and rendering them to the homepage (GET)
router.get("/", (req, res) => {
    Post.findAll({
        attributes: ["id", "post_text", "title"],
        include: [{
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
        //passing a single object into the homepage (handlebar)
        const posts = data.map(post => post.get({ plain: true }));
        res.render("homepage", { posts, loggedIn: req.session.loggedIn });
    }).catch(err => {
        res.status(500).json(err);
        console.log(err);
    });
});

//login redirect (GET)
router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("login");
});

//signup render (GET)
router.get("/signup", (req, res) => {
    res.render("signup");
});

//one post render to single post page (GET)
router.get("/post/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
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
        if (!data) {//if there is no data, return appropriate err msg
            res.status(404).json({ message: "There is no post with this id" });
            return;
        }

        const post = data.get({ plain: true });
        res.render("single-post", { post, loggedIn: req.session.loggedIn });

    }).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});

module.exports = router;