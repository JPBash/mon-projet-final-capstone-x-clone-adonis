import type { HttpContext } from '@adonisjs/core/http'
import Hashtag from '#models/hashtag'

export default class StoreController {
  public async handle({ auth, request, response }: HttpContext) {
    const content = request.input('content')
    const parentId = request.input('parentId') // Facultatif : seulement si c'est une réponse

    // 1. On vérifie si l'utilisateur est bien connecté et si le texte n'est pas vide
    if (!auth.user || !content) {
      return response.redirect().back()
    }

    // 2. On crée le tweet lié à l'utilisateur
    const tweet = await auth.user.related('tweets').create({
      content: content,
      parentId: parentId || null
    })

    // 3. Extraction et liaison des hashtags
    const hashtags = content.match(/#(\w+)/g)
    if (hashtags) {
      const hashtagIds: number[] = []
      for (const tag of hashtags) {
        const tagName = tag.substring(1).toLowerCase()
        const hashtag = await Hashtag.firstOrCreate({ name: tagName })
        hashtagIds.push(hashtag.id)
      }
      await tweet.related('hashtags').sync(hashtagIds)
    }

    // 4. On revient à l'accueil
    return response.redirect().toPath('/')
  }
}
