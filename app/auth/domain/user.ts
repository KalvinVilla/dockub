import { Entity } from '#core/domain/entity'
import { UserIdentifier } from '#auth/domain/user_identifier'

interface Properties {
  id: UserIdentifier
  email: string
  name: string
  password: string | null
}

export class User extends Entity<Properties> {
  getId() {
    return this.props.id.toString()
  }

  getMail() {
    return this.props.email
  }

  getPassword() {
    return this.props.password
  }

  static create(properties: Properties) {
    return new this(properties)
  }
}
