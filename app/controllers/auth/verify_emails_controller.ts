import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class VerifyEmailsController {
  public async handle({ request, response, auth }: HttpContext) {
    // On vérifie la signature URL cryptée par Adonis
    if (!request.hasValidSignature()) {
      return response.badRequest('Ce lien est invalide ou expiré.')
    }

    const email = request.param('email')
    const user = await User.findByOrFail('email', email)

    // On valide l'email
    user.isEmailVerified = true
    await user.save()

    // On connecte enfin l'utilisateur après vérification
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }
}
