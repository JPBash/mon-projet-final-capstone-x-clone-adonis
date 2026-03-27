import { type HttpContext } from '@adonisjs/core/http'

export default class StoreController {
  async handle({ request, response }: HttpContext) {
    // Logique pour créer un tweet (exemple basique)
    request.only(['content'])

    return response.redirect().back() // Ou rediriger vers une autre page
  }
}
