const { Schema, model } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionID: {
            objectId: new Schema.Types.objectId
        },
        reactionBody: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

reactionSchema.get(function () {
    let formattedDate = `${this.createdAt.getFullYear()}-`;
    formattedDate += `${`0${this.createdAt.getMonth() + 1}`.slice(-2)}-`;
    formattedDate += `${`0${this.createdAt.getDate()}`.slice(-2)}`;
    return formattedDate;
});

const Reaction = model('reaction', reactionSchema);

module.exports = Reaction;