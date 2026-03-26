"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, Scale } from "lucide-react"

const articleA = {
  id: "a",
  title: "Government Announces Historic Climate Agreement",
  source: "National Daily",
  manipulationScore: 7.8,
  politicalLeaning: -0.6,
  summary:
    "The article presents the climate agreement with heavily positive framing, using emotional language and selective expert quotes. It downplays economic concerns and presents opposition views dismissively. The headline uses superlatives without substantiation.",
}

const articleB = {
  id: "b",
  title: "Climate Deal Raises Economic Concerns for Industries",
  source: "Business Weekly",
  manipulationScore: 5.5,
  politicalLeaning: 0.4,
  summary:
    "This article focuses primarily on economic implications with moderate bias toward industry perspectives. While it presents some factual data, it omits environmental benefits and uses fear-based language around job losses. More balanced than Article A but still shows selective reporting.",
}

function getScoreColor(score: number) {
  if (score >= 7) return "text-red-400"
  if (score >= 4) return "text-yellow-400"
  return "text-emerald-400"
}

function getLeaningLabel(leaning: number) {
  if (leaning <= -0.5) return { label: "Left-Leaning", color: "text-blue-400" }
  if (leaning >= 0.5) return { label: "Right-Leaning", color: "text-red-400" }
  return { label: "Center", color: "text-muted-foreground" }
}

function getLeaningPosition(leaning: number) {
  return ((leaning + 1) / 2) * 100
}

export default function ComparePage() {
  const scoreDifference = Math.abs(articleA.manipulationScore - articleB.manipulationScore).toFixed(1)
  const moreManipulative = articleA.manipulationScore > articleB.manipulationScore ? "A" : "B"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Article Comparison</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="font-medium text-foreground">
              Article {moreManipulative} is more manipulative by{" "}
              <span className="text-red-400">{scoreDifference} points</span>
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ArticleCard
            article={articleA}
            label="Article A"
            isMoreManipulative={moreManipulative === "A"}
          />
          <ArticleCard
            article={articleB}
            label="Article B"
            isMoreManipulative={moreManipulative === "B"}
          />
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/reader">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
              Read Article A
            </Button>
          </Link>
          <Link href="/reader">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
              Read Article B
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function ArticleCard({
  article,
  label,
  isMoreManipulative,
}: {
  article: typeof articleA
  label: string
  isMoreManipulative: boolean
}) {
  const leaning = getLeaningLabel(article.politicalLeaning)

  return (
    <Card
      className={`bg-card transition-all ${
        isMoreManipulative ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-border"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="text-sm text-muted-foreground">{article.source}</span>
        </div>
        <CardTitle className="text-xl leading-tight text-foreground">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Manipulation Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(article.manipulationScore)}`}>
              {article.manipulationScore}/10
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500"
              style={{ width: `${article.manipulationScore * 10}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Political Leaning</span>
            <span className={`text-sm font-medium ${leaning.color}`}>{leaning.label}</span>
          </div>
          <div className="relative h-2 rounded-full bg-muted">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-gray-400 to-red-500 opacity-30" />
            <div
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground"
              style={{ left: `${getLeaningPosition(article.politicalLeaning)}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Left</span>
            <span>Center</span>
            <span>Right</span>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Summary</h4>
          <p className="text-sm leading-relaxed text-foreground">{article.summary}</p>
        </div>
      </CardContent>
    </Card>
  )
}
