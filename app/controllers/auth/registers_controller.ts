import User from '#models/user'
import Tweet from '#models/tweet'
import { type HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async showHome({ view, auth, request }: HttpContext) {
    const user = auth.user
    if (!user) return view.render('pages/home', { tweets: [] })

    // On récupère le type de flux via l'URL (ex: /?tab=following)
    const tab = request.input('tab', 'all')

    const query = Tweet.query()
      .preload('user')
      .preload('likes')
      .withCount('likes')
      .orderBy('createdAt', 'desc')

    // Si l'utilisateur clique sur "Abonnements"
    if (tab === 'following') {
      const followingIds = await user.related('following').query().select('following_id')
      const ids = followingIds.map((f) => f.followingId)
      query.whereIn('userId', ids)
    }

    const tweets = await query

    return view.render('pages/home', { tweets, currentTab: tab })
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    const user = await User.create(data)
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }

  public async showProfile({ view, auth }: HttpContext) {
    const user = auth.user!

    await user.loadCount('followers')
    await user.loadCount('following')

    const tweets = await Tweet.query()
      .where('userId', user.id)
      .preload('user')
      .preload('likes')
      .withCount('likes')
      .orderBy('createdAt', 'desc')

    return view.render('pages/profile', { user, tweets })
  }

  async updateProfile({ request, auth, response }: HttpContext) {
    const user = auth.user!

    const avatar = request.file('avatar', { size: '2mb', extnames: ['jpg', 'png', 'jpeg'] })
    const cover = request.file('cover', { size: '5mb', extnames: ['jpg', 'png', 'jpeg'] })

    if (avatar) {
      const fileName = `${randomUUID()}.${avatar.extname}`
      await avatar.move(app.publicPath('uploads'), { name: fileName })
      user.avatarUrl = `/uploads/${fileName}`
    }

    if (cover) {
      const fileName = `${randomUUID()}.${cover.extname}`
      await cover.move(app.publicPath('uploads'), { name: fileName })
      user.coverUrl = `/uploads/${fileName}`
    }

    user.bio = request.input('bio')
    await user.save()
    return response.redirect().back()
  }
}
