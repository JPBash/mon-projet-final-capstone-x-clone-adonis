# 𝕏 Clone - AdonisJS 6 & Edge

Bienvenue sur le projet **Clone X**, une application web fullstack moderne inspirée du réseau social X (Twitter), développée avec **AdonisJS 6** et le moteur de rendu **Edge**.

Ce projet a été réalisé dans le cadre de la formation **Kadea Academy** par l'agence **NovaTech**.

##  Fonctionnalités Principales

### Gestion des Comptes
- **Authentification sécurisée** : Inscription, Connexion et Déconnexion.
- **Vérification par Email (OTP)** : Sécurisation des comptes via un code unique envoyé par email.
- **Profil Utilisateur** : Personnalisation de l'avatar, de la bannière, de la biographie et du pseudo.

###  Social & Interaction
- **Tweets & Réponses** : Publication de textes (280 car.), réponses en cascade (thread) et suppression de ses propres tweets.
- **Système de Follow** : Suivre et se désabonner des autres utilisateurs.
- **Likes & Retweets** : Interagir avec le contenu et voir les compteurs en temps réel.
- **Recherche** : Recherche globale d'utilisateurs et de tweets, navigation par **Hashtags**.

###  Confidentialité & Sécurité
- **Blocage d'utilisateurs** : Empêcher mutuellement la vue des tweets et du profil.
- **Compte Privé** : Verrouiller son profil pour n'autoriser que les abonnés approuvés (système de demandes d'abonnement).
- **Middleware de Sécurité** : Accès restreint aux fonctionnalités sociales pour les comptes non vérifiés.

###  Intelligence Artificielle (Grok)
- **Générateur de Tweet** : Assistance à la rédaction basée sur votre contexte.
- **Suggestion de Hashtags** : Extraction intelligente des mots-clés.
- **Analyse d'Engagement** : Statistiques détaillées sur vos performances (engagement moyen, top tweet).

##  Installation & Lancement

1. **Cloner le projet** :
   ```bash
   git clone <url-du-repo>
   cd capstone-x-clone-adonis-JPBash
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer l'environnement** :
   Copiez le fichier `.env.example` en `.env` et configurez votre base de données PostgreSQL.

4. **Lancer les migrations et les données de test** :
   ```bash
   node ace migration:run
   node ace db:seed
   ```

5. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

##  Identifiants de Test (Seeders)

Utilisez ces comptes pour tester rapidement l'application après avoir lancé le seeder :

| Rôle | Email | Mot de passe | État |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `password123` | Vérifié / Public |
| **Elon** | `elon@x.com` | `password123` | Vérifié / Privé |
| **Visiteur** | `guest@test.com` | `password123` | Non Vérifié |

---

Développé  par **Bashizi Jean-Pierre** (@JPBash) KADEA ACADEMY DEV/Soir juin 2025-2026
