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
    if (!user) {
      return view.render('pages/welcome')
    }

    // On récupère les IDs des personnes suivies avec status 'accepted'
    const followingRow = await user.related('following').query()
      .where('status', 'accepted')
      .select('following_id')
    const followedIds = followingRow.map((f) => f.followingId)

    // On récupère les IDs des personnes bloquées (par moi ou qui m'ont bloqué)
    const blockingRow = await user.related('blocking').query().select('blocked_id')
    const blockingIds = blockingRow.map((b) => b.blockedId)

    const blockedByRow = await user.related('blockedBy').query().select('blocker_id')
    const blockedByIds = blockedByRow.map((b) => b.blockerId)

    const excludedIds = [...new Set([...blockingIds, ...blockedByIds])]

    const tab = request.input('tab', 'following')

    const query = Tweet.query()
      .whereIn('userId', followedIds)
      .whereNotIn('userId', excludedIds)
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

    let isFollowing = false
    let isBlocking = false
    let isBlocked = false
    let isPending = false

    if (auth.user) {
      const me = auth.user
      const follow = await me.related('following').query().where('following_id', user.id).first()
      isFollowing = follow?.status === 'accepted'
      isPending = follow?.status === 'pending'

      const block = await me.related('blocking').query().where('blocked_id', user.id).first()
      isBlocking = !!block

      const blockedBy = await me.related('blockedBy').query().where('blocker_id', user.id).first()
      isBlocked = !!blockedBy
    }

    let tweets: Tweet[] = []
    // On affiche les tweets si : 
    // 1. On n'est pas bloqué
    // 2. ET (Le compte n'est pas privé OU on est déjà abonné OU c'est notre propre compte)
    if (!isBlocked && (!user.isPrivate || isFollowing || (auth.user && user.id === auth.user.id))) {
      tweets = await user
        .related('tweets')
        .query()
        .preload('user')
        .preload('retweet', (q) => q.preload('user'))
        .withCount('likes')
        .withCount('replies')
        .withCount('retweets')
        .orderBy('createdAt', 'desc')
    }

    return view.render('pages/profile', { 
      user, 
      tweets, 
      isFollowing, 
      isBlocking, 
      isBlocked, 
      isPending 
    })
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
    user.isPrivate = !!request.input('isPrivate')
    await user.save()
    await user.save()
    return response.redirect().back()
  }

  async showFollowers({ params, view, auth, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const me = auth.user

    const isOwner = me?.id === user.id
    const follow = me ? await me.related('following').query().where('following_id', user.id).where('status', 'accepted').first() : null
    const isAcceptedFollower = !!follow

    if (user.isPrivate && !isOwner && !isAcceptedFollower) {
        return response.redirect().toRoute('profile.user.show', { id: user.id })
    }

    const followersRows = await user.related('followers').query().where('status', 'accepted').preload('follower')
    const users = followersRows.map((f) => f.follower)
    return view.render('pages/profiles/follows_list', { user, users, title: 'Abonnés' })
  }

  async showFollowing({ params, view, auth, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const me = auth.user

    const isOwner = me?.id === user.id
    const follow = me ? await me.related('following').query().where('following_id', user.id).where('status', 'accepted').first() : null
    const isAcceptedFollower = !!follow

    if (user.isPrivate && !isOwner && !isAcceptedFollower) {
        return response.redirect().toRoute('profile.user.show', { id: user.id })
    }

    const followingRows = await user.related('following').query().where('status', 'accepted').preload('following')
    const users = followingRows.map((f) => f.following)
    return view.render('pages/profiles/follows_list', { user, users, title: 'Abonnements' })
  }
}
