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

}

export default models