import mongoose from 'mongoose'

let models = {}

main().catch(err => console.log(err))

async function main() {
console.log("connecting to mongodb")
await mongoose.connect("mongodb+srv://phariha:phariha@cluster0.vdenqf5.mongodb.net/websharer?retryWrites=true&w=majority")

console.log("successfully connected to mongodb")

// Modify the Post Schema so it has the following fields:
// url (string)
// description (string)
// username (string) - should be the "username" in the session.account
// likes (array of strings) - should be an array of the usernames of people who liked the post
// created_date (date)
const postSchema = new mongoose.Schema({
    url: String,
    username: String,
    description: String,
    likes: [String],
    created_date: { type: Date, default: Date.now }
});

models.Post = mongoose.model('Post', postSchema)
console.log("mongoose post models created")

// Add a Comment schema/model with the following fields:
// username (string) - should be the "username" in the session.account
// comment (string) - the comment the user entered
// post: (object id of a Post)
// created_date (date)
const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    created_date: { type: Date, default: Date.now }
});

models.Comment = mongoose.model('Comment', commentSchema)
console.log("mongoose comment models created")

// Make a database schema and model for UserInfo
// Decide on at least one piece of user info you want to let a user modify about themselves
// (e.g., favorite ice cream, or personal website link)
// Add html and ajax calls for loading user info and updating user info (see the marked TODOs
// in the a6 client code)
// Add endpoints for loading and saving user info
const userSchema = new mongoose.Schema({
    username: String,
    favoriteFood: String,
    created_date: { type: Date, default: Date.now }
})

models.User = mongoose.model('User', userSchema)
console.log("mongoose user models created")
}

export default models