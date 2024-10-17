const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: { type: String, required: true },
    summary: String,
    content: String,
    cover: String,
    author: String,
    author: String,

    like: [{ type: Schema.Types.ObjectId, ref: "User" }],

    createdAt: Date,
    updatedAt: Date,
});

PostSchema.pre("save", function (next) {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 9); // KST is UTC +9

    this.updatedAt = currentDate;

    if (!this.createdAt) this.createdAt = currentDate;

    next();
});
const PostModal = model("Post", PostSchema);
module.exports = PostModal;
