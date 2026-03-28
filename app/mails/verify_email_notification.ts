import { BaseMail } from '@adonisjs/mail'

export default class VerifyEmailNotification extends BaseMail {
  from = 'j.pierrebash@gmail.com'
  subject = 'Votre code de vérification - X Clone'

  constructor(
    private fullName: string,
    private emailAddress: string,
    private otp: string
  ) {
    super()
  }

  prepare() {
    this.message.to(this.emailAddress)
    // On passe purement l'OTP à la vue au lieu d'une signature
    this.message.htmlView('emails/verify', { fullName: this.fullName, otp: this.otp })
  }
}