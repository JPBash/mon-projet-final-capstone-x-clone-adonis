import Tweet from '#models/tweet'
import type { HttpContext } from '@adonisjs/core/http'

export default class ShowsController {
  public async handle({ params, view }: HttpContext) {
    // 1. On cherche le Tweet principal avec toute sa "généalogie"
    const tweet = await Tweet.query()
      .where('id', params.id)
      .preload('user')
      .preload('likes')
      .withCount('likes')
      .withCount('replies')
      // S'il s'agit d'une réponse, on charge aussi le tweet parent pour le contexte
      .preload('parent', (parentQuery) => {
        parentQuery.preload('user')
      })
      // On charge tous les enfants (réponses)
      .preload('replies', (repliesQuery) => {
        repliesQuery
          .preload('user')
          .preload('likes')
          .withCount('likes')
          .withCount('replies')
          .orderBy('createdAt', 'desc')
      })
      .firstOrFail()

    return view.render('pages/tweets/show', { tweet })
  }
}
