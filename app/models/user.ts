import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
// app/models/user.ts
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Tweet from '#models/tweet'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  // on définit la relation entre User et Tweet
  // relation user -> tweets un utilisateur peut avoir plusieurs tweets
  @hasMany(() => Tweet)
  declare tweets: HasMany<typeof Tweet>

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
} 