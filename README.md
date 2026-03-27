[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/MnaD0mWv)

//- X-Clone - TP AdonisJS 6

Clone full-stack de X (Twitter) réalisé avec **AdonisJS 6**.

## Fonctionnalités

###  Profil & Personnalisation
- **Édition complète** : Bio, Avatar et Bannière.
- **Design X** : Avatar chevauchant et header sticky (flou).
- **Stats** : Compteurs dynamiques via relations Lucid.

###  Micro-blogging
- **Tweets** : Publication (280 car.) et suppression sécurisée.
- **Flux** : Onglets "Pour vous" vs "Abonnements".
- **Interactions** : Système de Likes avec retour visuel.

###  Sécurité
- **Auth** : Sessions gérées via Adonis Auth.
- **Protection** : Middlewares sur les routes sensibles.
- **REST** : Utilisation du Method Spoofing (`_method`).

// Installation rapide

1. Setup :
   Terminal : bash
   git clone <URL> && cd x-clone
   npm install
   
 2.Config :

Bash
cp .env.example .env
node ace generate:key

3.DB et Run :

Bash
node ace migration:run
npm run dev

// Stack
Backend : AdonisJS 6 (Lucid, Edge)

Frontend : CSS3 (Flexbox, Variables), JS Vanilla

DB : SQLite | Médias : Stockage local (/uploads)

Développé par BASHIZI MULUNGE Jean-Pierre - Kadea Academy DevSoir25
