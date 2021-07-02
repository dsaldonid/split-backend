const { BadRequestError, UnprocessableEntityError } = require("../utils/errors")
const db = require("../db")

class Nutrition {
    static async listNutritionForUser(user) {
        const query = `
      SELECT nutrition.id AS "nuId",
             nutrition.user_id AS "userId",
             nutrition.name AS "name",
             nutrition.category AS "cat",
             nutrition.calories AS "cal",
             nutrition.quantity AS "quant",
             nutrition.image_url AS "img"
      FROM nutrition
      WHERE nutrition.user_id = (SELECT id FROM users WHERE username = $1)
    `
        const result = await db.query(query, [user.username])
        return result.rows
    }

    static async createNutrition({ nutrition, user }) {
        if (!nutrition || !Object.keys(nutrition).length) {
            throw new BadRequestError("No nutrition info provided")
        }
        if (!user) {
            throw new BadRequestError("No user provided")
        }

        // create a new order
        const NutritionResult = await db.query(
            `
      INSERT INTO nutrition (user_id, name, category, calories, quantity,image_url) 
      VALUES ((SELECT id FROM users WHERE username = $1), $2, $3, $4, $5, $6)
      RETURNING id,name, category, calories, quantity, image_url
    `,
            [user.username, nutrition.name, nutrition.category, nutrition.calories, nutrition.quantity, nutrition.image_url]
        )
        // get orderId
        const NutritionId = NutritionResult.rows[0].id

        return await Nutrition.fetchNutritionById(NutritionId)
    }

    static async fetchNutritionById(NutritionId) {
        const result = await db.query(
    `
      SELECT nutrition.id AS "nuId",
             nutrition.user_id AS "userId",
             nutrition.name AS "name",
             nutrition.category AS "cat",
             nutrition.calories AS "cal",
             nutrition.quantity AS "quant",
             nutrition.image_url AS "img"
      FROM nutrition
      WHERE nutrition.id = $1
    `,
            [NutritionId]
        )

        return result.rows
    }
}

module.exports = Nutrition