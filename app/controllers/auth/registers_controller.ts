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

    // On récupère les IDs des personnes suivies
    const followingRow = await user.related('following').query().select('following_id')
    const followedIds = followingRow.map((f) => f.followingId)

    const tab = request.input('tab', 'following') // On force l'affichage 'following' ou on l'ignore selon le design

    const query = Tweet.query()
      .whereIn('userId', followedIds)
      .whereNull('parentId') // On n'affiche pas les réponses isolées sur l'accueil
      .preload('user')
      .preload('likes')
      .preload('retweet', (q) => q.preload('user'))
      .withCount('likes')
      .withCount('replies')
      .withCount('retweets')
      .orderBy('createdAt', 'desc')

    const tweets = await query

    return view.render('pages/home', { tweets, currentTab: tab })
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    const user = await User.create(data)
    
    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }
  public async showUserProfile({ params, view, auth }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .withCount('tweets')
      .withCount('followers')
      .withCount('following')
      .firstOrFail()

    const tweets = await user.related('tweets')
      .query()
      .preload('user')
      .preload('retweet', (q) => q.preload('user'))
      .withCount('likes')
      .withCount('replies')
      .withCount('retweets')
      .orderBy('createdAt', 'desc')

    let isFollowing = false
    if (auth.user) {
      const follow = await auth.user.related('following')
        .query()
        .where('following_id', user.id)
        .first()
      isFollowing = !!follow
    }

    return view.render('pages/profile', { user, tweets, isFollowing })
  }
  public async showProfile({ view, auth }: HttpContext) {
    const user = auth.user!

    await user.loadCount('followers')
    await user.loadCount('following')

    const tweets = await Tweet.query()
      .where('userId', user.id)
      .preload('user')
      .preload('likes')
      .preload('retweet', (q) => q.preload('user'))
      .withCount('likes')
      .withCount('replies')
      .withCount('retweets')
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

  async showFollowers({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const followersRows = await user.related('followers').query().preload('follower')
    const users = followersRows.map((f) => f.follower)
    return view.render('pages/profiles/follows_list', { user, users, title: 'Abonnés' })
  }

  async showFollowing({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const followingRows = await user.related('following').query().preload('following')
    const users = followingRows.map((f) => f.following)
    return view.render('pages/profiles/follows_list', { user, users, title: 'Abonnements' })
  }
}
