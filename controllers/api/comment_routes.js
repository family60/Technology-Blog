//imports
const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/authentication");

//get all comments (GET)
router.get("/", (req, res) => {
    Comment.findAll({}).then(data => res.json(data)).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});

//create new comments (POST)
router.post("/", withAuth, (req, res) => {
    if (req.session) {//if there is a current session (session didn't expire), allow the creatation of a new comment
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id,//using the id from the current session
        }).then(data => res.json(data)).catch(err => {//default err msg
            res.status(400).json(err);
            console.log(err);
        })
    }
});

//delete comment by id (DELETE)
router.delete("/:id", withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(data => {
        if (data) {//if there is no data, return appropriate err msg
            res.status(404).json({ message: "There is no comment with this id" });
            return;
        }

        res.json(data);

    }).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});

module.exports = router;