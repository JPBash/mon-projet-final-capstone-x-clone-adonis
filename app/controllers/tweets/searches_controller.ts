import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import User from '#models/user'
import Hashtag from '#models/hashtag'

export default class SearchesController {
  /**
   * Global search for tweets and users
   */
  async index({ request, view }: HttpContext) {
    const query = request.input('q')

    if (!query) {
      return view.render('pages/tweets/search_results', {
        tweets: [],
        users: [],
        query: '',
      })
    }

    const tweets = await Tweet.query()
      .where('content', 'like', `%${query}%`)
      .preload('user')
      .withCount('likes')
      .withCount('replies')
      .withCount('retweets')
      .orderBy('createdAt', 'desc')
      .limit(50)

    const users = await User.query()
      .where('fullName', 'like', `%${query}%`)
      .orWhere('email', 'like', `%${query}%`)
      .limit(20)

    return view.render('pages/tweets/search_results', {
      tweets,
      users,
      query,
    })
  }

  /**
   * Search tweets by hashtag
   */
  async hashtag({ params, view }: HttpContext) {
    const name = params.name

    const hashtag = await Hashtag.query()
      .where('name', name)
      .preload('tweets', (tweetsQuery) => {
        tweetsQuery
          .preload('user')
          .withCount('likes')
          .withCount('replies')
          .withCount('retweets')
          .orderBy('createdAt', 'desc')
      })
      .first()

    return view.render('pages/tweets/search_results', {
      tweets: hashtag?.tweets || [],
      users: [],
      query: `#${name}`,
    })
  }
}