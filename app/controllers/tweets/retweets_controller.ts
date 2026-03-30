import Tweet from '#models/tweet'
import type { HttpContext } from '@adonisjs/core/http'

export default class RetweetsController {
  public async handle({ auth, params, response, session }: HttpContext) {
    const user = auth.user!
    const tweetId = params.id

    // On cherche si un retweet existe déjà pour cet utilisateur et ce tweet
    const existingRetweet = await Tweet.query()
      .where('userId', user.id)
      .where('retweetId', tweetId)
      .first()

    if (existingRetweet) {
      // Si oui, on l'annule (delete)
      await existingRetweet.delete()
      session.flash('success', 'Retweet annulé')
    } else {
      // Sinon, on le crée
      await Tweet.create({
        userId: user.id,
        retweetId: tweetId,
        content: null,
      })
      session.flash('success', 'Tweet retweeté !')
    }

    return response.redirect().back()
  }
}
