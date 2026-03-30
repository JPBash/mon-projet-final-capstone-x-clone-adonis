import User from '#models/user'
import { signupStep1Validator, passwordValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import VerifyEmailNotification from '#mails/verify_email_notification'
import mail from '@adonisjs/mail/services/main'

export default class NewAccountController {
  async create({ view }: HttpContext) {
    return view.render('pages/auth/signup')
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(signupStep1Validator)

    // 1. Générer code 4 chiffres
    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    // 2. Stocker en session
    session.put('signup_data', { fullName: payload.fullName, email: payload.email, otp })

    // 3. Envoyer l'email en direct (send) au lieu d'asynchrone (sendLater) pour voir l'erreur tout de suite
    await mail.send(
      new VerifyEmailNotification(payload.fullName || 'Utilisateur', payload.email, otp)
    )

    return response.redirect().toRoute('auth.verify_otp.show')
  }

  async verifyShow({ view, session, response }: HttpContext) {
    const data = session.get('signup_data')
    if (!data) return response.redirect().toRoute('auth.register.show')
    return view.render('pages/auth/verify_otp', { email: data.email })
  }

  async verifyStore({ request, response, session }: HttpContext) {
    const data = session.get('signup_data')
    if (!data) return response.redirect().toRoute('auth.register.show')

    const code = request.input('code')
    if (code !== data.otp) {
      session.flash('errors.code', 'Code invalide')
      return response.redirect().back()
    }

    // Valide
    data.verified = true
    session.put('signup_data', data)
    return response.redirect().toRoute('auth.create_password.show')
  }

  async passwordShow({ view, session, response }: HttpContext) {
    const data = session.get('signup_data')
    if (!data || !data.verified) return response.redirect().toRoute('auth.register.show')
    return view.render('pages/auth/create_password', { fullName: data.fullName })
  }

  async passwordStore({ request, response, session, auth }: HttpContext) {
    const data = session.get('signup_data')
    if (!data || !data.verified) return response.redirect().toRoute('auth.register.show')

    const payload = await request.validateUsing(passwordValidator)

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: payload.password,
      isEmailVerified: true, // Le compte est créé APRÈS la vérification
    })

    session.forget('signup_data')

    // On connecte enfin
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }
}
