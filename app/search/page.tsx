"use client"

export const dynamic = "force-dynamic"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Search,
  ArrowLeft,
  Newspaper,
  BookOpen,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Article {
  id: number
  title: string
  description: string
  source: string
  url: string
  imageUrl: string | null
  publishedAt: string
  relevanceScore: number
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  return date.toLocaleDateString()
}

function SearchFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get("q") ?? ""

  const [query, setQuery] = useState(initialQuery)
  const [searchedQuery, setSearchedQuery] = useState("")
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim()
    if (!q) return

    setIsLoading(true)
    setError(null)
    setHasSearched(true)
    setSearchedQuery(q)

    try {
      const res = await fetch(`/api/search-news?q=${encodeURIComponent(q)}`)
      const data: { articles?: Article[]; error?: string } =
        await res.json().catch(() => ({}))

      if (!res.ok) throw new Error(data?.error ?? "Failed to search news")

      setArticles(Array.isArray(data.articles) ? data.articles : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) handleSearch(initialQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for news topics..."
              className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>

          <Button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Searching and filtering relevant articles...</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Using AI to ensure relevance</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="h-8 w-8 text-destructive mb-4" />
            <p className="text-foreground font-medium">Something went wrong</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button onClick={() => handleSearch()} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {!hasSearched && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-foreground font-medium">Search for a news topic</p>
            <p className="text-sm text-muted-foreground mt-1">
              Enter a topic above to find relevant articles for analysis
            </p>
          </div>
        )}

        {hasSearched && !isLoading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Newspaper className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-foreground font-medium">No relevant articles found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search term or broaden your query
            </p>
          </div>
        )}

        {!isLoading && !error && articles.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found{" "}
                <span className="font-medium text-foreground">
                  {articles.length} relevant articles
                </span>{" "}
                for{" "}
                <span className="font-medium text-primary">
                  &quot;{searchedQuery}&quot;
                </span>
              </p>
            </div>

            <div className="space-y-4">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)]"
                >
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Newspaper className="h-4 w-4" />
                      <span>{article.source}</span>
                      <span className="text-border">•</span>
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {article.relevanceScore}/10 relevance
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">
                      {article.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {article.description}
                    </p>

                    <div className="flex gap-3">
                      <Link
                        href={`/results?id=${article.id}&q=${encodeURIComponent(searchedQuery)}`}
                      >
                        <Button
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analyze
                        </Button>
                      </Link>

                      <Link href={`/reader?id=${article.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border text-foreground hover:bg-secondary"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Read Mode
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Original
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  )
}
