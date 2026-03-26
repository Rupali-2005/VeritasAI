"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ArrowLeft, Lightbulb, AlertTriangle, Info, CheckCircle } from "lucide-react"
import Link from "next/link"

// Sample article with pre-marked segments for demonstration
const sampleArticle = {
  title: "Climate Policy Under Fire as New Study Reveals Startling Data",
  source: "Global News Network",
  date: "March 25, 2026",
  segments: [
    { text: "In a ", type: "normal" as const },
    { text: "shocking revelation that should alarm every citizen", type: "manipulation" as const },
    { text: ", a new study released yesterday has presented data on climate change impacts that ", type: "normal" as const },
    { text: "proves beyond any doubt", type: "bias" as const },
    { text: " the urgent need for immediate policy action.\n\n", type: "normal" as const },
    { text: "The study, conducted by researchers at the National Climate Institute, found that ", type: "normal" as const },
    { text: "global temperatures have risen 1.2°C since pre-industrial levels", type: "fact" as const },
    { text: ", with projections suggesting a potential 2.5°C increase by 2050 under current emission trajectories.\n\n", type: "normal" as const },
    { text: "Critics of current environmental policies are ", type: "normal" as const },
    { text: "clearly out of touch with reality", type: "manipulation" as const },
    { text: " when they suggest that economic concerns should take precedence. ", type: "normal" as const },
    { text: "Only those who deny basic science", type: "bias" as const },
    { text: " could argue against the implementation of carbon reduction measures at this critical juncture.\n\n", type: "normal" as const },
    { text: "According to the report, ", type: "normal" as const },
    { text: "renewable energy sources now account for 29% of global electricity generation", type: "fact" as const },
    { text: ", up from 22% just five years ago. This ", type: "normal" as const },
    { text: "unprecedented surge", type: "bias" as const },
    { text: " in clean energy adoption demonstrates that transition is not only possible but already underway.\n\n", type: "normal" as const },
    { text: "The economic implications are equally significant. ", type: "normal" as const },
    { text: "The green energy sector has created 12 million jobs globally in 2025", type: "fact" as const },
    { text: ", while traditional fossil fuel industries ", type: "normal" as const },
    { text: "continue their inevitable decline", type: "manipulation" as const },
    { text: ". Investment in sustainable technologies has reached $1.8 trillion annually, representing ", type: "normal" as const },
    { text: "a historic turning point", type: "bias" as const },
    { text: " in how markets perceive long-term value.\n\n", type: "normal" as const },
    { text: "Environmental advocates ", type: "normal" as const },
    { text: "rightfully point out", type: "bias" as const },
    { text: " that delayed action will only increase costs and suffering in the future. The ", type: "normal" as const },
    { text: "moral imperative is clear to anyone with a conscience", type: "manipulation" as const },
    { text: ": we must act now to preserve our planet for future generations.", type: "normal" as const },
  ]
}

// Explanations for highlighted segments
const explanations: Record<string, { title: string; simplified: string; analysis: string }> = {
  "shocking revelation that should alarm every citizen": {
    title: "Emotional Appeal",
    simplified: "A new study was released with concerning findings.",
    analysis: "This phrase uses fear-inducing language ('shocking', 'alarm') to create urgency and emotional response rather than letting readers draw their own conclusions from the facts."
  },
  "proves beyond any doubt": {
    title: "Absolutist Claim",
    simplified: "The data strongly supports the need for action.",
    analysis: "Scientific studies rarely 'prove beyond any doubt' - this phrasing overstates certainty and leaves no room for nuance or ongoing research."
  },
  "global temperatures have risen 1.2°C since pre-industrial levels": {
    title: "Verifiable Fact",
    simplified: "Earth is about 1.2°C warmer than before industrialization.",
    analysis: "This is a factual claim that aligns with data from major climate organizations including NASA and NOAA."
  },
  "clearly out of touch with reality": {
    title: "Ad Hominem Attack",
    simplified: "Critics have different policy priorities.",
    analysis: "Rather than addressing critics' arguments, this dismisses them as irrational, a common manipulation technique to avoid substantive debate."
  },
  "Only those who deny basic science": {
    title: "False Dichotomy",
    simplified: "Some people have concerns about implementation approaches.",
    analysis: "This creates an either/or fallacy: agree with specific policies or be labeled a 'science denier', ignoring legitimate policy debates."
  },
  "renewable energy sources now account for 29% of global electricity generation": {
    title: "Verifiable Statistic",
    simplified: "About 29% of world electricity comes from renewable sources.",
    analysis: "This statistic can be verified through the International Energy Agency and similar organizations."
  },
  "unprecedented surge": {
    title: "Loaded Language",
    simplified: "Significant growth in clean energy.",
    analysis: "While growth is real, 'unprecedented surge' adds emotional weight that may overstate the rate of change."
  },
  "The green energy sector has created 12 million jobs globally in 2025": {
    title: "Employment Claim",
    simplified: "Many jobs exist in the green energy sector.",
    analysis: "This figure can be cross-referenced with International Renewable Energy Agency reports."
  },
  "continue their inevitable decline": {
    title: "Deterministic Framing",
    simplified: "Fossil fuel industries face challenges.",
    analysis: "Calling decline 'inevitable' presents one possible future as certain, removing complexity from energy transition discussions."
  },
  "a historic turning point": {
    title: "Hyperbolic Language",
    simplified: "Investment has grown significantly.",
    analysis: "While investment has increased, framing it as 'historic' adds dramatic weight without clear criteria."
  },
  "rightfully point out": {
    title: "Embedded Judgment",
    simplified: "Advocates argue that...",
    analysis: "Adding 'rightfully' signals the author's agreement, presenting one viewpoint as objectively correct."
  },
  "moral imperative is clear to anyone with a conscience": {
    title: "Moral Manipulation",
    simplified: "Many believe action is ethically important.",
    analysis: "This implies those who disagree lack moral standing, shutting down debate through shame rather than argument."
  }
}

type SegmentType = "normal" | "manipulation" | "bias" | "fact"

export default function ReaderPage() {
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)
  const [activeExplanation, setActiveExplanation] = useState<typeof explanations[string] | null>(null)
  const [activeType, setActiveType] = useState<SegmentType | null>(null)
  const articleRef = useRef<HTMLDivElement>(null)

  const getHighlightClass = (type: SegmentType) => {
    switch (type) {
      case "manipulation":
        return "bg-red-500/20 border-b-2 border-red-500 cursor-pointer hover:bg-red-500/30 transition-colors"
      case "bias":
        return "bg-yellow-500/20 border-b-2 border-yellow-500 cursor-pointer hover:bg-yellow-500/30 transition-colors"
      case "fact":
        return "bg-cyan-500/20 border-b-2 border-cyan-500 cursor-pointer hover:bg-cyan-500/30 transition-colors"
      default:
        return ""
    }
  }

  const handleSegmentClick = useCallback((text: string, type: SegmentType, event: React.MouseEvent) => {
    if (type === "normal") return
    
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.bottom + 8 })
    setSelectedText(text)
    setActiveType(type)
    
    if (explanations[text]) {
      setActiveExplanation(explanations[text])
    }
  }, [])

  const handleExplain = useCallback(() => {
    if (selectedText && explanations[selectedText]) {
      setActiveExplanation(explanations[selectedText])
    }
    setTooltipPosition(null)
  }, [selectedText])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipPosition && articleRef.current && !articleRef.current.contains(e.target as Node)) {
        setTooltipPosition(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [tooltipPosition])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
              <ArrowLeft className="size-5" />
              <ShieldAlert className="size-6" />
              <span className="font-semibold tracking-tight">VeritasAI</span>
            </Link>
            <Link href="/results">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                View Full Analysis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Article Column */}
          <div ref={articleRef}>
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{sampleArticle.source}</span>
                  <span>•</span>
                  <span>{sampleArticle.date}</span>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground leading-tight">
                  {sampleArticle.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="size-3 rounded bg-red-500"></span>
                    <span className="text-muted-foreground">Manipulation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="size-3 rounded bg-yellow-500"></span>
                    <span className="text-muted-foreground">Bias</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="size-3 rounded bg-cyan-500"></span>
                    <span className="text-muted-foreground">Factual Claim</span>
                  </div>
                </div>

                {/* Article Text */}
                <article className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed text-lg whitespace-pre-wrap">
                    {sampleArticle.segments.map((segment, index) => (
                      <span
                        key={index}
                        className={getHighlightClass(segment.type)}
                        onClick={(e) => handleSegmentClick(segment.text, segment.type, e)}
                      >
                        {segment.text}
                      </span>
                    ))}
                  </p>
                </article>
              </CardContent>
            </Card>
          </div>

          {/* Insights Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Lightbulb className="size-5 text-primary" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {activeExplanation ? (
                  <div className="space-y-6">
                    {/* Type Badge */}
                    <div className="flex items-center gap-2">
                      {activeType === "manipulation" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 border border-red-500/20">
                          <AlertTriangle className="size-4" />
                          Manipulation Detected
                        </span>
                      )}
                      {activeType === "bias" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-400 border border-yellow-500/20">
                          <Info className="size-4" />
                          Bias Indicator
                        </span>
                      )}
                      {activeType === "fact" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400 border border-cyan-500/20">
                          <CheckCircle className="size-4" />
                          Factual Claim
                        </span>
                      )}
                    </div>

                    {/* Selected Text */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Selected Text</h4>
                      <p className="text-foreground bg-muted/50 p-3 rounded-lg text-sm italic border border-border">
                        &ldquo;{selectedText}&rdquo;
                      </p>
                    </div>

                    {/* Technique */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Technique</h4>
                      <p className="text-lg font-semibold text-foreground">{activeExplanation.title}</p>
                    </div>

                    {/* Simplified */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Simplified Meaning</h4>
                      <p className="text-foreground">{activeExplanation.simplified}</p>
                    </div>

                    {/* Analysis */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Analysis</h4>
                      <p className="text-muted-foreground leading-relaxed">{activeExplanation.analysis}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted/50 mb-4">
                      <Lightbulb className="size-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Click on any highlighted text in the article to see detailed insights and analysis.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Explain Button */}
      {tooltipPosition && (
        <div
          className="fixed z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translateX(-50%)"
          }}
        >
          <Button
            onClick={handleExplain}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            <Lightbulb className="size-4 mr-1.5" />
            Explain
          </Button>
        </div>
      )}
    </main>
  )
}
