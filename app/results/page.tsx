"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ArrowLeft, AlertTriangle, TrendingUp, CheckCircle, XCircle, HelpCircle, FileText, MessageSquare } from "lucide-react"
import Link from "next/link"

// Sample analysis data
const analysisData = {
  manipulationScore: 7.8,
  verdict: "Highly Manipulative",
  techniques: [
    { name: "Emotional Appeal", severity: 8.5, explanation: "Uses fear-inducing language to create urgency without factual basis" },
    { name: "Ad Hominem Attacks", severity: 7.2, explanation: "Dismisses critics through personal attacks rather than addressing arguments" },
    { name: "False Dichotomy", severity: 6.8, explanation: "Presents complex issues as binary choices with no middle ground" },
    { name: "Appeal to Authority", severity: 5.5, explanation: "Overstates the conclusiveness of scientific consensus" },
  ],
  politicalLeaning: {
    label: "Left-Leaning",
    confidence: 78,
    position: 25, // 0 = far left, 50 = center, 100 = far right
  },
  factualClaims: [
    { claim: "Global temperatures have risen 1.2°C since pre-industrial levels", status: "true" as const },
    { claim: "Renewable energy sources account for 29% of global electricity", status: "true" as const },
    { claim: "Green energy sector created 12 million jobs globally in 2025", status: "unverifiable" as const },
    { claim: "Investment in sustainable technologies reached $1.8 trillion annually", status: "true" as const },
    { claim: "Fossil fuel industries are in inevitable decline", status: "false" as const },
  ],
  rhetoricalSummary: "This article employs a persuasion strategy centered on creating urgency through emotional language while positioning any opposition as morally deficient. The author uses a combination of fear appeals ('shocking revelation', 'should alarm'), absolutist claims ('proves beyond any doubt'), and moral framing ('anyone with a conscience') to discourage critical engagement with the actual policy arguments. While the underlying data cited is largely accurate, the framing systematically excludes nuance and legitimate counterarguments, presenting a one-sided narrative as objective truth.",
  cleanRewrite: `A new study from the National Climate Institute presents data on climate change impacts, highlighting the need for policy discussion on environmental measures.

The research found that global temperatures have risen 1.2°C since pre-industrial levels, with projections suggesting a potential 2.5°C increase by 2050 under current emission trajectories.

The study has reignited debate between environmental advocates pushing for immediate carbon reduction measures and critics who argue economic implications must be carefully weighed.

Renewable energy now accounts for 29% of global electricity generation, up from 22% five years ago. The green energy sector has reportedly created 12 million jobs globally in 2025, while investment in sustainable technologies has reached $1.8 trillion annually.

Supporters of aggressive climate action argue that delayed measures will increase future costs, while opponents contend that the economic and social impacts of rapid transitions require more careful consideration.`
}

function getScoreColor(score: number) {
  if (score >= 7) return "text-red-400"
  if (score >= 4) return "text-yellow-400"
  return "text-green-400"
}

function getScoreBarColor(score: number) {
  if (score >= 7) return "bg-red-500"
  if (score >= 4) return "bg-yellow-500"
  return "bg-green-500"
}

function getSeverityColor(severity: number) {
  if (severity >= 7) return "text-red-400 bg-red-500/10 border-red-500/20"
  if (severity >= 4) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
  return "text-green-400 bg-green-500/10 border-green-500/20"
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
              <ArrowLeft className="size-5" />
              <ShieldAlert className="size-6" />
              <span className="font-semibold tracking-tight">VeritasAI</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/reader">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  View Article
                </Button>
              </Link>
              <Link href="/report">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Export Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Manipulation Score - Hero Section */}
        <Card className="border-border bg-card mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-red-400 mb-4">
                <AlertTriangle className="size-6" />
                <span className="text-sm font-medium uppercase tracking-wider">Analysis Complete</span>
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className={`text-7xl font-bold tracking-tight ${getScoreColor(analysisData.manipulationScore)}`}>
                  {analysisData.manipulationScore}
                </span>
                <span className="text-2xl text-muted-foreground">/10</span>
              </div>
              <p className="text-xl font-semibold text-foreground">{analysisData.verdict}</p>
            </div>

            {/* Score Bar */}
            <div className="max-w-md mx-auto">
              <div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 relative">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 size-5 rounded-full bg-foreground border-2 border-background shadow-lg"
                  style={{ left: `${(analysisData.manipulationScore / 10) * 100}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Objective</span>
                <span>Moderate</span>
                <span>Manipulative</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Detected Manipulation Techniques */}
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="size-5 text-red-400" />
                Detected Manipulation Techniques
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {analysisData.techniques.map((technique, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(technique.severity)}`}>
                      {technique.severity.toFixed(1)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{technique.name}</h4>
                      <p className="text-sm text-muted-foreground">{technique.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Political Leaning */}
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="size-5 text-primary" />
                Political Leaning
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-foreground">{analysisData.politicalLeaning.label}</span>
                  <span className="ml-3 text-muted-foreground">({analysisData.politicalLeaning.confidence}% confidence)</span>
                </div>
              </div>
              <div className="relative">
                <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-gray-400 to-red-500">
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 size-5 rounded-full bg-foreground border-2 border-background shadow-lg"
                    style={{ left: `${analysisData.politicalLeaning.position}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Left</span>
                  <span>Center</span>
                  <span>Right</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Factual Claims */}
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CheckCircle className="size-5 text-green-400" />
                Factual Claims
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {analysisData.factualClaims.map((claim, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="mt-0.5">
                      {claim.status === "true" && <CheckCircle className="size-5 text-green-400" />}
                      {claim.status === "false" && <XCircle className="size-5 text-red-400" />}
                      {claim.status === "unverifiable" && <HelpCircle className="size-5 text-yellow-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{claim.claim}</p>
                    </div>
                    <div>
                      {claim.status === "true" && (
                        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400 border border-green-500/20">
                          Likely True
                        </span>
                      )}
                      {claim.status === "false" && (
                        <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 border border-red-500/20">
                          Likely False
                        </span>
                      )}
                      {claim.status === "unverifiable" && (
                        <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-400 border border-yellow-500/20">
                          Unverifiable
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rhetorical Summary */}
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MessageSquare className="size-5 text-primary" />
                Rhetorical Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground leading-relaxed">{analysisData.rhetoricalSummary}</p>
            </CardContent>
          </Card>

          {/* Clean Rewrite */}
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="size-5 text-primary" />
                Neutral Rewrite
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{analysisData.cleanRewrite}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  Copy Neutral Version
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Analyze Another Article
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
