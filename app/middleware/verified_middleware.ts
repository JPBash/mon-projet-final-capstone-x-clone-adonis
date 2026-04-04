import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class VerifiedMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    // Si on est connecté mais pas vérifié, on force la vérification
    if (user && !user.isEmailVerified) {
      return ctx.response.redirect().toRoute('auth.verify_otp.show')
    }

    return await next()
  }
}