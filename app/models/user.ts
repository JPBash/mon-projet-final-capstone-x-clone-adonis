import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash' // Importation du service de hashage
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Tweet from '#models/tweet'
import Like from '#models/like'
import Follow from './follow.ts'

const AuthFinder = withAuthFinder(hash, {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare bio: string | null

  @column({ columnName: 'avatar_url' })
  declare avatarUrl: string | null

  @column({ columnName: 'cover_url' })
  declare coverUrl: string | null

  @column()
  declare isEmailVerified: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Tweet)
  declare tweets: HasMany<typeof Tweet>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  get initials() {
    if (this.fullName) {
      const parts = this.fullName.trim().split(/\s+/)
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
      }
      return parts[0].slice(0, 2).toUpperCase()
    }
    return this.email.slice(0, 2).toUpperCase()
  }

  @hasMany(() => Follow, { foreignKey: 'followerId' })
  declare following: HasMany<typeof Follow> // Les gens que JE suis

  @hasMany(() => Follow, { foreignKey: 'followingId' })
  declare followers: HasMany<typeof Follow> // Les gens qui ME suivent
}
