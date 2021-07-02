const { BadRequestError } = require("../utils/errors")
const db = require("../db")

class Exercise {
  static async listExerciseForUser(user) {
    const query = `
      SELECT exercise.id AS "exId",
             exercise.user_id AS "userId",
             exercise.name AS "name",
             exercise.category AS "cat",
             exercise.duration AS "dur",
             exercise.intensity AS "tense"
      FROM exercise
      WHERE exercise.user_id = (SELECT id FROM users WHERE username = $1)
    `
    const result = await db.query(query, [user.username])
    return result.rows
  }

  static async createExercise({ exercise, user }) {
    if (!exercise || !Object.keys(exercise).length) {
      throw new BadRequestError("No exercise info provided")
    }
    if (!user) {
      throw new BadRequestError("No user provided")
    }

    // create a new order
    const exerciseResult = await db.query(
      `
      INSERT INTO exercise (user_id, name, category, duration, intensity) 
      VALUES ((SELECT id FROM users WHERE username = $1), $2, $3, $4, $5)
      RETURNING id,name, category,duration,intensity
    `,
      [user.username, exercise.name, exercise.category, exercise.duration, exercise.intensity]
    )
    
    // get orderId
    const exerciseId = exerciseResult.rows[0].id

    return await Exercise.fetchExerciseById(exerciseId)
  }

  static async fetchExerciseById(exerciseId) {
    const result = await db.query(
      `
      SELECT exercise.id AS "exId",
             exercise.user_id AS "userId",
             exercise.category AS "cat",
             exercise.duration AS "dur",
             exercise.intensity AS "tense"
      FROM exercise
      WHERE exercise.id = $1
    `,
      [exerciseId]
    )

    return result.rows
  }
}

module.exports = Exercise