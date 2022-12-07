//imports
const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/authentication");

//get all users (GET)
router.get("/", (req, res) => {
    //find all users in User table
    User.findAll({
        attributes: { exclude: ["password"] }
    }).then(data => res.json(data)).catch(err => {//default err msg
        res.status(500).json(err);
    });
});
//get one user by id (GET)
router.get("/:id", (req, res => {
    User.findOne({
        attributes: { exclude: ["password"] },
        where: {
            id: req.params.id
        },
        include: [{
            model: Post,
            attributes: ["id", "title", "post_text"]
        },
        {
            model: Comment,
            attributes: ["id", "comment_text"],
            include: {
                module: Post,
                attributes: ["title"]
            }
        }
        ]
    }), then(data => {
        if (!data) {//if no data is found, return appropriate err msg
            res.status(404).json({ message: "There is no user with this id" });
            return;
        }

        res.json(data);

    }).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
}));

//create new user (POST)
router.post("/", (req, res) => {
    User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }).then(data => {
        req.session.save(() => {//storing the users data into the current session
            req.session.user_id = data.id;
            req.session.username = data.username;
            req.session.loggedIn = true;
            res.json(data);
        });
    });
});

//update a user (PUT)
router.put("/:id", withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    }).then(data => {
        if (!data[0]) {//if no data is found, return appropriate err msg
            res.status(404).json({ message: "There is no user with this id" });
            return;
        }

        res.json(data);

    }).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});

//delete one user by id (DELETE)
router.delete("/:id", withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(data => {
        if (!data) {//if no data is found, return appropriate err msg
            res.status(404).json({ message: "There is no user with this id" });
            return;
        }

        res.json(data);

    }).catch(err => {//default err msg
        res.status(500).json(err);
        console.log(err);
    });
});




//Login (POST)
router.post("/login", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(data => {
        if (!data) {//if no data is found, return appropriate err msg
            res.status(400).json({ message: "There is no user with that email" });
            return;
        }
        //validate user
        const validPassword = data.checkPassword(req.body.password);
        if (!validPassword) {//if password does not checkout, return err msg
            res.status(400).json({ message: "Incorrect password" });
            return;
        }
        req.session.save(() => {//storing the users data into the current session
            req.session.user_id = data.id;
            req.session.username = data.username;
            req.session.loggedIn = true;
            res.json({ user: data, message: 'You are now logged in' });
        });
    });
});
//Logout (POST)
router.post("/logout", withAuth, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;