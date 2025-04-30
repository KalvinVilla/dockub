export interface PgTables {
  tablename: string
  schemaname: string
}

export interface Users {
  id: string
  name: string
  email: string
  password: string
}

export interface DB {
  pg_tables: PgTables
  users: Users
}
