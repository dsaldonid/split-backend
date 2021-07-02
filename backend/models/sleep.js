const { BadRequestError, UnprocessableEntityError } = require("../utils/errors")
const db = require("../db")

class Sleep {
    static async listSleepForUser(user) {
        const query =
            `
      SELECT sleep.id AS "sId",
             sleep.created_at AS "create",
             sleep.user_id AS "userId",
             sleep.start_time AS "start",
             sleep.end_time AS "end"
      FROM sleep
      WHERE sleep.user_id = (SELECT id FROM users WHERE username = $1)
    `
        const result = await db.query(query, [user.username])
        return result.rows
    }

    static async createSleep({ sleep, user }) {
        if (!sleep || !Object.keys(sleep).length) {
            throw new BadRequestError("No sleep info provided")
        }
        if (!user) {
            throw new BadRequestError("No user provided")
        }

        // create a new order
        const SleepResult = await db.query(
            `
      INSERT INTO Sleep (user_id, start_time, end_time) 
      VALUES ((SELECT id FROM users WHERE username = $1), $2, $3)
      RETURNING id,start_time, end_time, created_at
    `,
            [user.username, sleep.start_time, sleep.end_time]
        )
        // get orderId
        const SleepId = SleepResult.rows[0].id

        return await Sleep.fetchSleepById(SleepId)
    }

    static async fetchSleepById(SleepId) {
        const result = await db.query(
     `
        SELECT sleep.id AS "sId",
                sleep.created_at AS "create",
                sleep.user_id AS "userId",
                sleep.start_time AS "start",
                sleep.end_time AS "end"
        FROM Sleep
        WHERE Sleep.id = $1
    `,
            [SleepId]
        )

        return result.rows
    }
}

module.exports = Sleep