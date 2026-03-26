import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"

const groq = createGroq({
  apiKey: process.env.GROQ_KEY,
})

interface NewsAPIArticle {
  source: { id: string | null; name: string }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  try {
    // Fetch articles from NewsAPI
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&pageSize=15&language=en&apiKey=${process.env.NEWS_API_KEY}`
    
    const newsResponse = await fetch(newsApiUrl)
    const newsData: NewsAPIResponse = await newsResponse.json()

    if (newsData.status !== "ok" || !newsData.articles?.length) {
      return NextResponse.json({ 
        articles: [], 
        message: "No articles found" 
      })
    }

    // Filter out articles with missing essential data
    const validArticles = newsData.articles.filter(
      (article) => article.title && article.description && article.source?.name
    )

    if (validArticles.length === 0) {
      return NextResponse.json({ articles: [], message: "No valid articles found" })
    }

    // Use Groq to rank articles by relevance to the topic
    const articlesForAnalysis = validArticles.slice(0, 10).map((article, index) => ({
      index,
      title: article.title,
      description: article.description,
    }))

    const { object: relevanceAnalysis } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        rankedArticles: z.array(
          z.object({
            index: z.number().describe("The original index of the article"),
            relevanceScore: z.number().min(0).max(10).describe("How relevant this article is to the search topic (0-10)"),
            isRelevant: z.boolean().describe("Whether this article is actually about the search topic"),
          })
        ),
      }),
      prompt: `You are analyzing news articles for relevance to the search topic: "${query}"

Here are the articles to analyze:
${articlesForAnalysis.map((a) => `[${a.index}] Title: ${a.title}\nDescription: ${a.description}`).join("\n\n")}

For each article, determine:
1. How relevant it is to the search topic (0-10 score)
2. Whether it's actually about the topic or just mentions it tangentially

Only mark articles as relevant (isRelevant: true) if they are genuinely about the topic, not just mentioning keywords.
Rank them by relevance score.`,
    })

    // Filter and sort articles based on Groq's analysis
    const relevantArticles = relevanceAnalysis.rankedArticles
      .filter((r) => r.isRelevant && r.relevanceScore >= 5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map((r) => {
        const article = validArticles[r.index]
        return {
          id: r.index,
          title: article.title,
          description: article.description,
          source: article.source.name,
          url: article.url,
          imageUrl: article.urlToImage,
          publishedAt: article.publishedAt,
          relevanceScore: r.relevanceScore,
        }
      })

    return NextResponse.json({
      articles: relevantArticles,
      totalFound: newsData.totalResults,
      query,
    })
  } catch (error) {
    console.error("Search news error:", error)
    return NextResponse.json(
      { error: "Failed to search news" },
      { status: 500 }
    )
  }
}
