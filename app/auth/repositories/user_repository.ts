import { User } from '#auth/domain/user'
import { UserIdentifier } from '#auth/domain/user_identifier'
import { db } from '#core/services/db'
import { DB } from '#types/db'
import hash from '@adonisjs/core/services/hash'
import { ReferenceExpression } from 'kysely'

interface UpdateUserProfile {
  id: string
  email: string
  notificationEnabled: 0 | 1
  notificationEndpoint: string
  notificationP256dh: string
  notificationAuth: string
}

interface StoreUserPayload {
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  notificationEnabled: 0 | 1
  notificationEndpoint: string | null
  notificationP256dh: string | null
  notificationAuth: string | null
}

export class UserRepository {
  #clause: ReferenceExpression<DB, 'users'> | null = null

  where(clause: ReferenceExpression<DB, 'users'>) {
    this.#clause = clause
    return this
  }

  async create(payload: StoreUserPayload) {
    const userRecord = await db
      .insertInto('users')
      .values({
        id: UserIdentifier.generate().toString(),
        name: payload.name,
        email: payload.email,
        password: await hash.make(payload.password),
        notification_enabled: payload.notificationEnabled,
        notification_endpoint: payload.notificationEndpoint || '',
        notification_p256dh: payload.notificationP256dh || '',
        notification_auth: payload.notificationAuth || '',
      })
      .returningAll()
      .executeTakeFirst()

    if (!userRecord) {
      throw new Error('Failed to create user')
    }

    return User.create({
      id: UserIdentifier.fromString(userRecord.id),
      name: userRecord.name,
      password: userRecord.password,
      email: userRecord.email,
      notificationEnabled: userRecord.notification_enabled,
      notificationEndpoint: userRecord.notification_endpoint,
      notificationP256dh: userRecord.notification_p256dh,
      notificationAuth: userRecord.notification_auth,
    })
  }

  async all(value: any) {
    const userRecords = await db
      .selectFrom('users')
      .selectAll()
      .$if(this.#clause !== null, (builder) => {
        return builder.where(this.#clause!, '=', value)
      })
      .execute()

    return userRecords.map((userRecord) =>
      User.create({
        id: UserIdentifier.fromString(userRecord.id),
        name: userRecord.name,
        password: userRecord.password,
        email: userRecord.email,
        notificationEnabled: userRecord.notification_enabled,
        notificationEndpoint: userRecord.notification_endpoint,
        notificationP256dh: userRecord.notification_p256dh,
        notificationAuth: userRecord.notification_auth,
      })
    )
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
      notificationEnabled: userRecord.notification_enabled,
      notificationEndpoint: userRecord.notification_endpoint,
      notificationP256dh: userRecord.notification_p256dh,
      notificationAuth: userRecord.notification_auth,
    })
  }

  async updateProfile(user: UpdateUserProfile) {
    await db
      .updateTable('users')
      .set({
        email: user.email,
        notification_enabled: user.notificationEnabled,
        notification_endpoint: user.notificationEndpoint,
        notification_p256dh: user.notificationP256dh,
        notification_auth: user.notificationAuth,
      })
      .where('id', '=', user.id)
      .executeTakeFirst()
  }
}
