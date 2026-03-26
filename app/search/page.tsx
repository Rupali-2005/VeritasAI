"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, ArrowLeft, Newspaper, BookOpen, BarChart3 } from "lucide-react"

const searchResults = [
  {
    id: 1,
    title: "Government Announces Historic Climate Agreement at Global Summit",
    description:
      "World leaders have reached a landmark climate deal that promises to reduce carbon emissions by 50% over the next decade. The agreement includes binding commitments from major economies.",
    source: "National Daily",
    date: "2 hours ago",
  },
  {
    id: 2,
    title: "Climate Deal Raises Economic Concerns for Manufacturing Industries",
    description:
      "Industry experts warn that the new climate regulations could lead to significant job losses in the manufacturing sector. Business groups are calling for transition support.",
    source: "Business Weekly",
    date: "4 hours ago",
  },
  {
    id: 3,
    title: "Scientists Praise Climate Summit Outcomes as Step Forward",
    description:
      "Leading climate researchers say the agreement, while not perfect, represents meaningful progress toward limiting global temperature rise to 1.5 degrees Celsius.",
    source: "Science Today",
    date: "5 hours ago",
  },
  {
    id: 4,
    title: "Opposition Party Criticizes Climate Deal as Economically Reckless",
    description:
      "Political opponents are pushing back against the climate agreement, arguing it will harm working families and put the nation at a competitive disadvantage.",
    source: "Political Observer",
    date: "6 hours ago",
  },
  {
    id: 5,
    title: "What the Climate Agreement Means for Your Energy Bills",
    description:
      "Consumer advocates break down how the new climate policies might affect household energy costs over the coming years, with mixed predictions from analysts.",
    source: "Consumer Report",
    date: "8 hours ago",
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState("climate agreement")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for news topics..."
              className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Search
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found <span className="font-medium text-foreground">{searchResults.length} articles</span> for{" "}
            <span className="font-medium text-primary">&quot;{query}&quot;</span>
          </p>
        </div>

        <div className="space-y-4">
          {searchResults.map((article) => (
            <Card
              key={article.id}
              className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)]"
            >
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Newspaper className="h-4 w-4" />
                  <span>{article.source}</span>
                  <span className="text-border">•</span>
                  <span>{article.date}</span>
                </div>

                <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">
                  {article.title}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {article.description}
                </p>

                <div className="flex gap-3">
                  <Link href="/results">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analyze
                    </Button>
                  </Link>
                  <Link href="/reader">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border text-foreground hover:bg-secondary"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read Mode
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            Load More Results
          </Button>
        </div>
      </main>
    </div>
  )
}
