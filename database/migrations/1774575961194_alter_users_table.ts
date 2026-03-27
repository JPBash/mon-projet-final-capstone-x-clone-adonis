import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('avatar_url').nullable()
      table.string('cover_url').nullable()
      table.text('bio').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('avatar_url')
      table.dropColumn('cover_url')
      table.dropColumn('bio')
    })
  }
}
