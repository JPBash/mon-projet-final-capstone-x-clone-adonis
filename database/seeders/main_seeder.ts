import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Tweet from '#models/tweet'

export default class extends BaseSeeder {
  async run() {
    // 1. Créer un compte de test pour toi
    const me = await User.create({
      fullName: 'Bashizi Jean-Pierre',
      email: 'admin@test.com',
      password: 'password123',
    })

    // 2. Créer quelques utilisateurs fictifs
    const users = await User.createMany([
      { fullName: 'Elon Musk', email: 'elon@x.com', password: 'password123' },
      { fullName: 'Adonis Master', email: 'dev@adonis.js', password: 'password123' },
      { fullName: 'Kadea Student', email: 'student@kadea.cd', password: 'password123' }
    ])

    // 3. Ajouter des tweets réalistes
    await Tweet.createMany([
      { userId: me.id, content: "Mon clone de X est enfin en ligne sur Railway ! 🚀 #AdonisJS #Kadea" },
      { userId: users[0].id, content: "I love this new X clone. Very fast! 🚀" },
      { userId: users[1].id, content: "AdonisJS 6 est vraiment incroyable pour le backend." },
      { userId: users[2].id, content: "Est-ce que quelqu'un a vu mon dernier commit ?" }
    ])
  }
}