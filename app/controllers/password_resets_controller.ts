import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import ResetPasswordNotification from '#mails/reset_password_notification'
import mail from '@adonisjs/mail/services/main'
import { passwordValidator } from '#validators/user'

export default class PasswordResetsController {
  // Afficher la page "Entrez votre email"
  async showForgot({ view }: HttpContext) {
    return view.render('pages/auth/forgot_password')
  }

  // Envoyer le lien sécurisé
  async sendLink({ request, response, session }: HttpContext) {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (!user) {
      // Pour des raisons de sécurité, ne pas indiquer que l'email n'existe pas
      session.flash('success', 'Si cet e-mail existe, un lien vous a été envoyé.')
      return response.redirect().back()
    }

    // Envoi du lien Magique
    await mail.send(new ResetPasswordNotification(user))

    session.flash('success', 'Le lien de réinitialisation a été envoyé !')
    return response.redirect().toRoute('auth.login.show')
  }

  // Vérifier le lien et afficher la page de "Nouveau mot de passe"
  async showReset({ request, response, view }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.badRequest('Ce lien de réinitialisation est invalide ou expiré.')
    }
    const email = request.param('email')
    const signature = request.input('signature') // On conserve la signature cryptée

    return view.render('pages/auth/reset_password', { email, signature })
  }

  // Modifier le mot de passe en base de données
  async storeReset({ request, response, auth }: HttpContext) {
    // Retester la signature URL au cas où !
    if (!request.hasValidSignature()) {
      return response.badRequest('Lien corrompu.')
    }

    const email = request.param('email')
    const user = await User.findByOrFail('email', email)

    // On réutilise le même validateur que l'inscription !
    const payload = await request.validateUsing(passwordValidator)

    user.password = payload.password
    await user.save()

    // Connexion immédiate
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }
}
