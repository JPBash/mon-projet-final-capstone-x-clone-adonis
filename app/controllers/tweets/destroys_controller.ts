import { type HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'

export default class DestroysController {
  async handle({ params, auth, response }: HttpContext) {
    // 1. On cherche le tweet par son ID
    const tweet = await Tweet.findOrFail(params.id)

    // 2. Sécurité : On vérifie que l'utilisateur est bien le propriétaire
    if (tweet.userId !== auth.user!.id) {
      return response.unauthorized('Vous ne pouvez pas supprimer ce tweet.')
    }

    // 3. Suppression
    await tweet.delete()

    // 4. Retour à la page précédente
    return response.redirect().back()
  }
}
