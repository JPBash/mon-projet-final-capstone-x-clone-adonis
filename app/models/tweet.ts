import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Like from '#models/like'


export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: string | null

  @column()
  declare userId: number

  @column()
  declare parentId: number | null

  @column()
  declare retweetId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @belongsTo(() => Tweet, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Tweet>

  @hasMany(() => Tweet, { foreignKey: 'parentId' })
  declare replies: HasMany<typeof Tweet>

  @belongsTo(() => Tweet, { foreignKey: 'retweetId' })
  declare retweet: BelongsTo<typeof Tweet>

  @hasMany(() => Tweet, { foreignKey: 'retweetId' })
  declare retweets: HasMany<typeof Tweet>
}
