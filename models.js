import mongoose from 'mongoose'

let models = {}

main().catch(err => console.log(err))

async function main(){
console.log("connecting to mongodb")
await mongoose.connect("mongodb+srv://phariha:phariha@cluster0.vdenqf5.mongodb.net/websharer?retryWrites=true&w=majority")

console.log("successfully connected to mongodb")

// "postSchema" with the following types:
// url (a string)
// description (a string)
// created_date (a date)
const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    created_date: { type: Date, default: Date.now },
});

models.Post = mongoose.model('Post', postSchema)
console.log("mongoose models created")
}

export default models