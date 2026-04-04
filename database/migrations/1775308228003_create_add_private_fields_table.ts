import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_private_fields'

  async up() {
    this.schema.alterTable('users', (table) => {
      table.boolean('is_private').defaultTo(false).notNullable()
    })

    this.schema.alterTable('follows', (table) => {
      // status: 'pending' ou 'accepted'
      table.string('status').defaultTo('accepted').notNullable()
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('is_private')
    })

    this.schema.alterTable('follows', (table) => {
      table.dropColumn('status')
    })
  }
}