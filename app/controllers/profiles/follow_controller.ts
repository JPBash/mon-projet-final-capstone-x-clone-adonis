import { type HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Follow from '#models/follow'

export default class FollowsController {
  async handle({ params, auth, response }: HttpContext) {
    const userToFollow = await User.findOrFail(params.id)
    const me = auth.user!

    if (userToFollow.id === me.id) {
      return response.badRequest('Vous ne pouvez pas vous suivre vous-même')
    }

    const existingFollow = await Follow.query()
      .where('follower_id', me.id)
      .where('following_id', userToFollow.id)
      .first()

    if (existingFollow) {
      await existingFollow.delete()
    } else {
      await Follow.create({
        followerId: me.id,
        followingId: userToFollow.id,
        status: userToFollow.isPrivate ? 'pending' : 'accepted'
      })
    }

    return response.redirect().back()
  }
}
