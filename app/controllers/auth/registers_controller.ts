import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  /**
   * Affiche le formulaire d'inscription
   */
  async show({ view }: HttpContext) {
    return view.render('auth/register')
  }
  async showHome({ view }: HttpContext) {
    return view.render('pages/home')
  }
  /**
   * Enregistre l'utilisateur en base de données
   */
  async store({ request, response, auth }: HttpContext) {
    // 1. Récupérer les données du formulaire
    const data = request.only(['full_name', 'email', 'password'])

    // 2. Créer l'utilisateur dans PostgreSQL
    const user = await User.create(data)

    // 3. Connecter l'utilisateur automatiquement
    await auth.use('web').login(user)

    // 4. Rediriger vers la home
    return response.redirect().toRoute('home')
  }
}