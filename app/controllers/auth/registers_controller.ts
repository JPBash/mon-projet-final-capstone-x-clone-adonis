import User from '#models/user'
import Tweet from '#models/tweet'
import { type HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
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

// ... à l'intérieur de ta classe RegisterController
  async updateProfile({ request, auth, response }: HttpContext) {
    const user = auth.user!

    const avatar = request.file('avatar', { size: '2mb', extnames: ['jpg', 'png', 'jpeg'] })
    const cover = request.file('cover', { size: '5mb', extnames: ['jpg', 'png', 'jpeg'] })

    if (avatar) {
      const fileName = `${cuid()}.${avatar.extname}`
      await avatar.move(app.publicPath('uploads'), { name: fileName })
      user.avatarUrl = `/uploads/${fileName}`
    }

    if (cover) {
      const fileName = `${cuid()}.${cover.extname}`
      await cover.move(app.publicPath('uploads'), { name: fileName })
      user.coverUrl = `/uploads/${fileName}`
    }

    await user.save()
    return response.redirect().back()
  }
}
