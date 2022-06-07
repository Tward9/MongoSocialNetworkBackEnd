const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

const thoughts = async (userId) => {
    let usersThoughts = await User.aggregate([
        {
            $match: { _id: ObjectId(userId) }
        },
        {
            $unwind: { path: '$thoughts' },
        },
        {
            $group: {
                _id: userId,
            }
        },
    ]);

    console.log('Users Thoughts: ', usersThoughts);
    return usersThoughts;
}
const friends = async (userId) => {
    let usersFriends = await User.aggregate([
        {
            $match: { _id: ObjectId(userId) }
        },
        {
            $unwind: { path: '$friends' },
        },
        {
            $group: {
                _id: userId,
            }
        },
    ]);

    console.log('Users Friends: ', usersFriends);
    return usersFriends;
}
module.exports = {
    //get all users
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    //get single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .lean()
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json({
                        user,
                        thoughts: await thoughts(req.params.studentId),
                        friends: await friends(req.params.studentId),
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // Update a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id!' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Delete a user
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No such user exists' })
                    : res.json({ message: 'User successfully deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Add a friend to a user
    addFriend(req, res) {
        console.log('You are adding a friend');
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'No user found with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Remove friend from user
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { friendId: req.params.friendId } } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'No user found with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
}