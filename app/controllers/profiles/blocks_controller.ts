import type { HttpContext } from '@adonisjs/core/http'
import Block from '#models/block'

export default class BlocksController {
    async store({ params, auth, response }: HttpContext) {
        const user = auth.user!
        const targetId = params.id

        if (user.id === Number(targetId)) return response.badRequest()

        // Créer le blocage s'il n'existe pas déjà
        await Block.firstOrCreate({
            blockerId: user.id,
            blockedId: targetId,
        })

        return response.redirect().back()
    }

    async destroy({ params, auth, response }: HttpContext) {
        const user = auth.user!

        const block = await Block.query()
            .where('blockerId', user.id)
            .where('blockedId', params.id)
            .first()

        if (block) await block.delete()

        return response.redirect().back()
    }
}
