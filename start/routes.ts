import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
const RegisterController = () => import('#controllers/auth/registers_controller')
const TweetsStoreController = () => import('#controllers/tweets/stores_controller')

// 1. La page d'accueil (Home)
router.get('/', [RegisterController, 'showHome']).as('home')

router
  .group(() => {
    // Page d'affichage de l'inscription
    router.get('signup', [controllers.NewAccount, 'create']).as('auth.register.show')

    // Route de soumission du formulaire d'inscription
    router.post('signup', [controllers.NewAccount, 'store']).as('new_account.store')

    // Routes de connexion
    router.get('login', [controllers.Session, 'create']).as('auth.login.show')
    router.post('login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())
//  Groupe pour les connectés
router
  .group(() => {
    router.get('/profile', [RegisterController, 'showProfile']).as('profile.show')
    router.post('/profile/update', [RegisterController, 'updateProfile']).as('profile.update')
    router.post('logout', [controllers.Session, 'destroy']).as('auth.logout')

    // Route pour poster un tweet
    router.post('tweets', [TweetsStoreController, 'handle']).as('tweets.store')
  })
  .use(middleware.auth())

router
  .delete('/tweets/:id', '#controllers/tweets/destroys_controller.handle')
  .as('tweets.destroy')

  .use(middleware.auth())
router
  .post('/tweets/:id/like', '#controllers/tweets/likes_controller.handle')
  .as('tweets.like')
  .use(middleware.auth())

router
  .post('/profile/:id/follow', '#controllers/profiles/follows_controller.handle')
  .as('profile.follow')
  .use(middleware.auth())

router.get('/profile/:id', [RegisterController, 'showUserProfile']).as('profile.user.show')
