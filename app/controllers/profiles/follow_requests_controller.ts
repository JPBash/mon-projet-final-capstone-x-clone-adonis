import { type HttpContext } from '@adonisjs/core/http'
import Follow from '#models/follow'

export default class FollowRequestsController {
  async index({ view, auth }: HttpContext) {
    const user = auth.user!
    
    const requests = await Follow.query()
      .where('following_id', user.id)
      .where('status', 'pending')
      .preload('follower')

    return view.render('pages/profiles/follow_requests', { requests })
  }

  async accept({ params, response }: HttpContext) {
    const follow = await Follow.findOrFail(params.id)
    follow.status = 'accepted'
    await follow.save()

    return response.redirect().back()
  }

  async reject({ params, response }: HttpContext) {
    const follow = await Follow.findOrFail(params.id)
    await follow.delete()

    return response.redirect().back()
  }
}
