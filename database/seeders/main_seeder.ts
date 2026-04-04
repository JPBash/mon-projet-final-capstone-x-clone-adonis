import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Tweet from '#models/tweet'

export default class extends BaseSeeder {
  async run() {
    // 1. Créer un compte administrateur (Vérifié)
    const admin = await User.create({
      fullName: 'Bashizi Jean-Pierre',
      email: 'admin@test.com',
      password: 'password123',
      isEmailVerified: true,
      bio: 'Développeur Fullstack passionné par AdonisJS.'
    })

    // 2. Créer un compte privé (Vérifié)
    const privateUser = await User.create({
      fullName: 'Elon Musk',
      email: 'elon@x.com',
      password: 'password123',
      isEmailVerified: true,
      isPrivate: true,
      bio: 'Chief Troll Officer. Mars is the goal.'
    })

    // 3. Créer un compte non vérifié (pour tester le middleware)
    await User.create({
      fullName: 'Guest User',
      email: 'guest@test.com',
      password: 'password123',
      isEmailVerified: false
    })

    // 4. Créer d'autres utilisateurs
    const users = await User.createMany([
      { fullName: 'Adonis Master', email: 'dev@adonis.ts', password: 'password123', isEmailVerified: true },
      { fullName: 'Kadea Ninja', email: 'ninja@kadea.cd', password: 'password123', isEmailVerified: true },
    ])

    // 5. Ajouter des tweets
    await Tweet.createMany([
      {
        userId: admin.id,
        content: 'Mon clone de X est enfin prêt ! 🚀 #AdonisJS #Kadea #WebDev',
      },
      { userId: privateUser.id, content: 'X is the everything app. 𝕏' },
      { userId: users[0].id, content: 'La visibilité des tweets est maintenant gérée par le blocage et le mode privé !' },
    ])

    // 6. Ajouter des follows (Acceptés)
    await admin.related('following').create({
        followingId: users[0].id,
        status: 'accepted'
    })

    await users[1].related('following').create({
        followingId: admin.id,
        status: 'accepted'
    })
  }
}
