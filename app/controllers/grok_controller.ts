import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'

export default class GrokController {
  public async generate({ request, response, session }: HttpContext) {
    const content = (request.input('content') || '').trim()

    if (!content) {
      session.flash('error', 'Ajoutez un texte avant de demander une suggestion Grok.')
      return response.redirect().back()
    }

    const suggestion = this.enrichTweet(content)
    const tags = this.extractSuggestedHashtags(suggestion)

    session.flash('grok_result', {
      title: 'Suggestion de tweet',
      text: suggestion,
      tags,
    })

    return response.redirect().back()
  }

  public async hashtags({ request, response, session }: HttpContext) {
    const content = (request.input('content') || '').trim()

    if (!content) {
      session.flash('error', 'Ajoutez un texte pour obtenir des hashtags.')
      return response.redirect().back()
    }

    const tags = this.extractSuggestedHashtags(content)

    session.flash('grok_result', {
      title: 'Hashtags suggérés',
      text: tags.join(' '),
      tags,
    })

    return response.redirect().back()
  }

  public async analyze({ auth, response, session }: HttpContext) {
    if (!auth.user) {
      session.flash('error', 'Vous devez être connecté pour analyser vos tweets.')
      return response.redirect().back()
    }

    const tweets = await Tweet.query()
      .where('userId', auth.user.id)
      .preload('likes')
      .preload('retweets')
      .preload('replies')
      .orderBy('createdAt', 'desc')

    const totalTweets = tweets.length
    const totalLikes = tweets.reduce((sum, tweet) => sum + tweet.likes.length, 0)
    const totalRetweets = tweets.reduce((sum, tweet) => sum + tweet.retweets.length, 0)
    const totalReplies = tweets.reduce((sum, tweet) => sum + tweet.replies.length, 0)

    const averageEngagement =
      totalTweets > 0
        ? ((totalLikes + totalRetweets + totalReplies) / totalTweets).toFixed(1)
        : '0.0'

    let topTweet: Tweet | null = null
    let topScore = -1

    for (const tweet of tweets) {
      const score = tweet.likes.length + tweet.retweets.length + tweet.replies.length
      if (score > topScore) {
        topScore = score
        topTweet = tweet
      }
    }

    session.flash('grok_analysis', {
      totalTweets,
      totalLikes,
      totalRetweets,
      totalReplies,
      averageEngagement,
      topTweet: topTweet?.content || 'Aucun tweet marquant pour le moment.',
      recommendations: this.buildRecommendations({
        totalTweets,
        totalLikes,
        totalRetweets,
        totalReplies,
      }),
    })

    return response.redirect().back()
  }

  private enrichTweet(content: string) {
    const cleaned = content.replace(/\s+/g, ' ').trim()
    const starters = ['Idée du jour :', 'Point important :', 'À retenir :']
    const intro = starters[Math.floor(Math.random() * starters.length)]

    if (cleaned.length < 60) {
      return `${intro} ${cleaned} — Qu’en pensez-vous ?`
    }

    return `${intro} ${cleaned}\n\nVotre avis m’intéresse.`
  }

  private extractSuggestedHashtags(content: string): string[] {
    const words = content
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 4)

    const uniqueWords = [...new Set(words)].slice(0, 4)
    const generated = uniqueWords.map((word) => `#${word}`)

    return [...new Set([...generated, '#XClone', '#Tendance'])].slice(0, 6)
  }

  private buildRecommendations(data: {
    totalTweets: number
    totalLikes: number
    totalRetweets: number
    totalReplies: number
  }) {
    const recommendations: string[] = []

    if (data.totalTweets < 5) {
      recommendations.push('Publiez plus souvent pour gagner en visibilité.')
    }

    if (data.totalLikes <= data.totalTweets) {
      recommendations.push('Ajoutez des hashtags précis pour augmenter la portée.')
    }

    if (data.totalReplies === 0) {
      recommendations.push('Posez une question dans vos tweets pour encourager les réponses.')
    }

    if (data.totalRetweets < 3) {
      recommendations.push(
        'Utilisez des messages plus courts et directs pour favoriser les repartages.'
      )
    }

    if (recommendations.length === 0) {
      recommendations.push('Très bon engagement global, continuez ainsi.')
    }

    return recommendations
  }
}
