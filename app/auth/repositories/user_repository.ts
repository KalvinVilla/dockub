import { User } from '#auth/domain/user'
import { UserIdentifier } from '#auth/domain/user_identifier'
import { db } from '#core/services/db'
import { DB } from '#types/db'
import { ReferenceExpression } from 'kysely'

export class UserRepository {
  #clause: ReferenceExpression<DB, 'users'> | null = null

  where(clause: ReferenceExpression<DB, 'users'>) {
    this.#clause = clause
    return this
  }

  async find(value: string) {
    const userRecord = await db
      .selectFrom('users')
      .selectAll()
      .$if(this.#clause !== null, (builder) => {
        return builder.where(this.#clause!, '=', value)
      })
      .executeTakeFirst()

    if (!userRecord) {
      return null
    }

    return User.create({
      id: UserIdentifier.fromString(userRecord.id),
      name: userRecord.name,
      password: userRecord.password,
      email: userRecord.email,
    })
  }
}
