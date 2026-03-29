import type { HttpContext } from '@adonisjs/core/http'

export default class StoreController {
  public async handle({ auth, request, response }: HttpContext) {
    const content = request.input('content')
    const parentId = request.input('parentId') // Facultatif : seulement si c'est une réponse

    // 1. On vérifie si l'utilisateur est bien connecté et si le texte n'est pas vide
    if (!auth.user || !content) {
      return response.redirect().back()
    }

    // 2. On crée le tweet lié à l'utilisateur
    await auth.user.related('tweets').create({
      content: content,
      parentId: parentId || null
    })

    // 3. On revient à l'accueil
    return response.redirect().toPath('/')
  }
}
