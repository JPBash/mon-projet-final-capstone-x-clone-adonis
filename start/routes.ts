import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
const RegisterController = () => import('#controllers/auth/registers_controller')
const TweetsStoreController = () => import('#controllers/tweets/stores_controller')
const VerifyEmailsController = () => import('#controllers/auth/verify_emails_controller')

// 1. La page d'accueil (Home)
router.get('/', [RegisterController, 'showHome']).as('home')

router
  .group(() => {
    // Page d'affichage de l'inscription
    router.get('signup', [controllers.NewAccount, 'create']).as('auth.register.show')

    // Route de soumission du formulaire d'inscription (Stockage Infos + Envoi mail)
    router.post('signup', [controllers.NewAccount, 'store']).as('new_account.store')

    // Routes de vérification OTP
    router.get('signup/verify', [controllers.NewAccount, 'verifyShow']).as('auth.verify_otp.show')
    router.post('signup/verify', [controllers.NewAccount, 'verifyStore']).as('auth.verify_otp.store')

    // Routes de création de mot de passe finaux
    router.get('signup/password', [controllers.NewAccount, 'passwordShow']).as('auth.create_password.show')
    router.post('signup/password', [controllers.NewAccount, 'passwordStore']).as('auth.create_password.store')

    // Routes de connexion
    router.get('login', [controllers.Session, 'create']).as('auth.login.show')
    router.post('login', [controllers.Session, 'store']).as('session.store')

    // Routes Mot de Passe Oublié
    router.get('forgot-password', '#controllers/password_resets_controller.showForgot').as('auth.forgot_password.show')
    router.post('forgot-password', '#controllers/password_resets_controller.sendLink').as('auth.forgot_password.send')
    router.get('reset-password/:email', '#controllers/password_resets_controller.showReset').as('auth.reset_password.show')
    router.post('reset-password/:email', '#controllers/password_resets_controller.storeReset').as('auth.reset_password.store')
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

router.get('/verify-email/:email', [VerifyEmailsController, 'handle']).as('verifyEmail')
