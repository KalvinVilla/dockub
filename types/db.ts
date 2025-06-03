export interface PgTables {
  tablename: string
  schemaname: string
}

export interface Users {
  id: string
  name: string
  email: string
  password: string
  notification_enabled: 0 | 1
  notification_endpoint: string
  notification_p256dh: string
  notification_auth: string
}

export interface DB {
  pg_tables: PgTables
  users: Users
}
