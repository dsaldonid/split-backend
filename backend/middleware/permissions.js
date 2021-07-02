const Exercise = require("../models/exercise")
const { BadRequestError, ForbiddenError } = require("../utils/errors")

const authedUserOwnsPost = async (req,res,next) => {
    try{
        const { user } = res.locals 
        const { exerciseId } = req.params
        const post = await Exercise.fetchExerciseById(exerciseId)

        if ((exercise.userId !== user.id)){
            throw new ForbiddenError("User is not allowed to update other users' exercise")
        }

        res.locals.exercise = exercise

        return next()
    }catch(err){
        return next(err)
    }
}

module.exports = {
    authedUserOwnsPost,
}