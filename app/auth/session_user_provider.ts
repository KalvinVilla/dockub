import { symbols } from '@adonisjs/auth'
import { User } from '#auth/domain/user'
import { db } from '#core/services/db'
import type { SessionGuardUser, SessionUserProviderContract } from '@adonisjs/auth/types/session'
import { UserIdentifier } from '#auth/domain/user_identifier'

export class SessionKyselyUserProvider implements SessionUserProviderContract<User> {
  declare [symbols.PROVIDER_REAL_USER]: User

  async createUserForGuard(user: User): Promise<SessionGuardUser<User>> {
    return {
      getId() {
        return user.getIdentifier().toString()
      },

      getOriginal() {
        return user
      },
    }
  }

  async findById(identifier: string): Promise<SessionGuardUser<User> | null> {
    const userRecord = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', identifier)
      .executeTakeFirst()

    if (!userRecord) {
      return null
    }

    const user = User.create({
      id: UserIdentifier.fromString(userRecord.id),
      email: userRecord.email,
      name: userRecord.name,
      password: userRecord.password,
    })

    return this.createUserForGuard(user)
  }
}
