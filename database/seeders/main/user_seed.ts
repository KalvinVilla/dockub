import { DB } from '#types/db'
import hash from '@adonisjs/core/services/hash'
import { Kysely } from 'kysely'

import { v7 as randomUUID } from 'uuid'

export default async function seed(db: Kysely<DB>) {
  const id = randomUUID()
  const name = 'admin'
  const email = 'admin@example.com'
  const password = 'admin'

  const hashedPassword = await hash.make(password)

  await db
    .insertInto('users')
    .values({
      id,
      name: name,
      email,
      password: hashedPassword,
      notification_enabled: 0,
      notification_auth: '',
      notification_endpoint: '',
      notification_p256dh: '',
    })
    .returning('id')
    .executeTakeFirstOrThrow()
}
