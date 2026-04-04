import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'blocks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // L'utilisateur qui bloque
      table.integer('blocker_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      // L'utilisateur bloqué
      table.integer('blocked_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.unique(['blocker_id', 'blocked_id']) // Unicité

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
