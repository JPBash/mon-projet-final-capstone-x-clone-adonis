import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import env from '#start/env' // Importation de l'environnement

const dbConfig = defineConfig({
  /**
   * Définition de la connexion par défaut à utiliser pour les requêtes
   */
  connection: env.get('DB_CONNECTION') || 'pg',

  prettyPrintDebugQueries: true,

  connections: {
    /**
     * PostgreSQL connection activée
     */
    pg: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: Number(env.get('DB_PORT')),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },

    // Configuration pour SQLite (optionnelle, peut être utilisée pour les tests ou le développement)
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },
  },
})

export default dbConfig
