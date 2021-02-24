require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let exerciseSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date }
});

const findUser = require('./userRepository.js').findById;
let Exercise = mongoose.model('Exercise', exerciseSchema);

const createAndSaveExercise = async (objExercise) => {
    try {
        let user = await findUser({ _id: objExercise.userId })

        if (!user || user.error) {
            return { error: 'User required/not found' }
        }

        if (!objExercise.date) {
            objExercise.date = new Date();
        }else{
            if(new Date(objExercise.date) == 'Invalid Date'){
                return { error: 'Ivalid date' }
            }
        }

        const newExercise = new Exercise(objExercise)
        let response = await newExercise.save()
        return { _id: user._id, username: user.username, date: new Date(response.date).toDateString(), duration: response.duration, description: response.description};
    } catch (error) {
        return { error: error.toJSON().message }
    }
};

const logExercise = async (userId, from = '', to = '', limit = 0) => {
    let filter = {};
    let cols = { _id: 0, description: 1, duration: 1, date: 1 }

    if (!userId) {
        return { msj: 'User id required' };
    }

    try {
        let user = await findUser(userId);
        if (!user || user.error) {
            return { msj: 'User not found' };
        }

        filter.userId = userId;

        if (from && to) {
            filter.date = {
                $gte: from,
                $lt: to
            }
        }

        let chain = Exercise.find(filter);

        if (limit) {
            chain.limit(Number.parseInt(limit))
        }

        chain.select(cols);
        let excercises = await chain.exec();

        let count = excercises.length;
        return { _id: user._id, username: user.username, count: count, log: excercises }

    } catch (error) {
        return { error }
    }
}

exports.createAndSaveExercise = createAndSaveExercise;
exports.logExercise = logExercise;