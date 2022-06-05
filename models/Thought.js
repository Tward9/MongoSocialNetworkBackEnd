const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');


const thoughtSchema = new Schema(
    {
        thoughText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema.virutal('reactionCount').get(function () {
    return `${this.reactions.length}`
}).get(function () {
    let formattedDate = `${this.createdAt.getFullYear()}-`;
    formattedDate += `${`0${this.createdAt.getMonth() + 1}`.slice(-2)}-`;
    formattedDate += `${`0${this.createdAt.getDate()}`.slice(-2)}`;
    return formattedDate;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;