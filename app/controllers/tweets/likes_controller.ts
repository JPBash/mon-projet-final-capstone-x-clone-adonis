import { type HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'

export default class LikesController {
  async handle({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const tweet = await Tweet.findOrFail(params.id)

    // On cherche si le like existe déjà
    const existingLike = await user.related('likes').query().where('tweet_id', tweet.id).first()

    if (existingLike) {
      await existingLike.delete()
    } else {
      await user.related('likes').create({ tweetId: tweet.id })
    }

    return response.redirect().back()
  }
}
