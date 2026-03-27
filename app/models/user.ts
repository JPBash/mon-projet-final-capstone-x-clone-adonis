import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
// app/models/user.ts
import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Tweet from '#models/tweet'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @hasMany(() => Tweet)
  declare tweets: HasMany<typeof Tweet>
  @column()
  declare avatarUrl: string | null

  @column()
  declare coverUrl: string | null

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
