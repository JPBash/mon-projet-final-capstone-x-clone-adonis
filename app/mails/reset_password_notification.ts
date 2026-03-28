import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'
import router from '@adonisjs/core/services/router'

export default class ResetPasswordNotification extends BaseMail {
  from = 'j.pierrebash@gmail.com'
  subject = 'Demande de réinitialisation de mot de passe - X Clone'

  constructor(private user: User) {
    super()
  }

  prepare() {
    // Créer une URL signée valable seulemenet 15 minutes
    const url = router.makeSignedUrl('auth.reset_password.show', { email: this.user.email }, { expiresIn: '15m' })
    const signedUrl = `http://localhost:3333${url}`

    this.message.to(this.user.email)
    this.message.htmlView('emails/reset_password', { user: this.user, signedUrl })
  }
}
