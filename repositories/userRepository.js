require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
    username: { type: String, required: true }
});

let User = mongoose.model('User', userSchema);

const createAndSave = async (username) => {
    try {
        const newUser = new User({ username });
        let response = await newUser.save();
        return response;
    } catch (err) {
        return { error: 'User name required' }
    }
};

const getAll = async () => {
    try {
        const res = await User.find({})
        return res;
    } catch (err) {
        return { error: "Wrong" }
    }
};

const findById = async (id) => {
    try {
        const res = await User.findOne({_id: id })
        return res;
    } catch (err) {
        return { error: "Wrong" }
    }
};


exports.getAll = getAll;
exports.createAndSave = createAndSave;
exports.findById = findById;