//imports
const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");


//User can have many Posts
User.hasMany(Post, {
    foreignKey: "user_id"
});
//User can have many Comments
User.hasMany(Comment, {
    foreignKey: "user_id"
});

//Post can only have one User
Post.belongsTo(User, {
    foreignKey: "user_id"
});
//Post can have many Comments
Post.hasMany(Comment, {
    foreignKey: "post_id"
});

//Comment can only have one User
Comment.belongsTo(User, {
    foreignKey: "user_id"
});
//Comment can only have one Post
Comment.belongsTo(Post, {
    foreignKey: "post_id"
});

module.exports = {User, Post, Comment};