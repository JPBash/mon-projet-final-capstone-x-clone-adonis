import User from '#models/user'
import Tweet from '#models/tweet'
import { type HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async showHome({ view, auth }: HttpContext) {
    const user = auth.user
    let tweets: Tweet[] = []

    if (user) {
      tweets = await Tweet.query().preload('user').orderBy('createdAt', 'desc')
    }

    return view.render('pages/home', { tweets })
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    const user = await User.create(data)
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }

  public async showProfile({ view, auth }: HttpContext) {
    const user = auth.user!

    const tweets = await user.related('tweets').query().orderBy('createdAt', 'desc')
    return view.render('pages/profile', { user, tweets })
  }
}
