"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldAlert, ArrowLeft, Download, FileText, CheckCircle, XCircle, HelpCircle } from "lucide-react"
import Link from "next/link"

// Sample analysis data (same as results page)
const analysisData = {
  manipulationScore: 7.8,
  verdict: "Highly Manipulative",
  articleTitle: "Climate Crisis: New Study Reveals Alarming Trends",
  articleSource: "Global News Network",
  analyzedDate: "March 26, 2026",
  techniques: [
    { name: "Emotional Appeal", severity: 8.5 },
    { name: "Ad Hominem Attacks", severity: 7.2 },
    { name: "False Dichotomy", severity: 6.8 },
    { name: "Appeal to Authority", severity: 5.5 },
  ],
  politicalLeaning: {
    label: "Left-Leaning",
    confidence: 78,
    position: 25,
  },
  factualClaims: [
    { claim: "Global temperatures have risen 1.2°C since pre-industrial levels", status: "true" as const },
    { claim: "Renewable energy sources account for 29% of global electricity", status: "true" as const },
    { claim: "Green energy sector created 12 million jobs globally in 2025", status: "unverifiable" as const },
    { claim: "Investment in sustainable technologies reached $1.8 trillion annually", status: "true" as const },
    { claim: "Fossil fuel industries are in inevitable decline", status: "false" as const },
  ],
  cleanRewrite: `A new study from the National Climate Institute presents data on climate change impacts, highlighting the need for policy discussion on environmental measures.

The research found that global temperatures have risen 1.2°C since pre-industrial levels, with projections suggesting a potential 2.5°C increase by 2050 under current emission trajectories.

Renewable energy now accounts for 29% of global electricity generation, up from 22% five years ago. The green energy sector has reportedly created 12 million jobs globally in 2025.`
}

function getScoreColor(score: number) {
  if (score >= 7) return "text-red-500"
  if (score >= 4) return "text-yellow-500"
  return "text-green-500"
}

function getSeverityBadge(severity: number) {
  if (severity >= 7) return "bg-red-100 text-red-700 border-red-200"
  if (severity >= 4) return "bg-yellow-100 text-yellow-700 border-yellow-200"
  return "bg-green-100 text-green-700 border-green-200"
}

export default function ReportPage() {
  const [reportName, setReportName] = useState("VeritasAI Analysis Report")

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    alert("PDF download would be triggered here. In production, this would use a library like jsPDF or a server-side PDF generation service.")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/results" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
              <ArrowLeft className="size-5" />
              <span className="text-sm font-medium">Back to Results</span>
            </Link>
            <div className="flex items-center gap-3">
              <Input
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="w-64 bg-muted border-border text-foreground text-sm"
                placeholder="Report name..."
              />
              <Button 
                onClick={handleDownload}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Download className="size-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Report Preview */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <p className="text-sm text-muted-foreground mb-4 text-center">Report Preview</p>
        
        {/* Report Document */}
        <Card className="border-border bg-card shadow-2xl">
          <CardContent className="p-0">
            {/* Report Inner - White background for print-ready look */}
            <div className="bg-[#fafafa] text-[#1a1a1a] rounded-lg overflow-hidden">
              {/* Report Header */}
              <div className="bg-[#0F172A] px-10 py-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="size-8 text-[#22D3EE]" />
                    <div>
                      <h1 className="text-2xl font-bold text-white tracking-tight">VeritasAI Report</h1>
                      <p className="text-sm text-[#94A3B8]">AI-Powered News Analysis</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-[#94A3B8]">
                    <p>Generated: {analysisData.analyzedDate}</p>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="px-10 py-8 space-y-8">
                {/* Article Info */}
                <div className="border-b border-[#e5e5e5] pb-6">
                  <p className="text-xs uppercase tracking-wider text-[#666] mb-2">Analyzed Article</p>
                  <h2 className="text-xl font-semibold text-[#1a1a1a] mb-1">{analysisData.articleTitle}</h2>
                  <p className="text-sm text-[#666]">Source: {analysisData.articleSource}</p>
                </div>

                {/* Manipulation Score */}
                <div className="flex items-center gap-8 p-6 bg-[#f0f0f0] rounded-lg">
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(analysisData.manipulationScore)}`}>
                      {analysisData.manipulationScore}
                    </div>
                    <div className="text-sm text-[#666] mt-1">out of 10</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Manipulation Score</h3>
                    <p className="text-sm text-[#666]">
                      This article has been rated as <span className="font-semibold text-red-600">{analysisData.verdict}</span>.
                      The analysis detected multiple persuasion techniques and biased framing.
                    </p>
                    {/* Score Bar */}
                    <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 relative">
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-white border-2 border-[#1a1a1a] shadow"
                        style={{ left: `${(analysisData.manipulationScore / 10) * 100}%`, transform: 'translate(-50%, -50%)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Political Leaning */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#666] mb-3">Political Leaning</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-[#1a1a1a]">{analysisData.politicalLeaning.label}</span>
                    <span className="text-sm text-[#666]">({analysisData.politicalLeaning.confidence}% confidence)</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-blue-500 via-gray-300 to-red-500 relative">
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-white border-2 border-[#1a1a1a] shadow"
                      style={{ left: `${analysisData.politicalLeaning.position}%`, transform: 'translate(-50%, -50%)' }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-[#999]">
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                  </div>
                </div>

                {/* Key Techniques */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#666] mb-3">Detected Techniques</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {analysisData.techniques.map((technique, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg border border-[#e5e5e5]">
                        <span className="font-medium text-[#1a1a1a] text-sm">{technique.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getSeverityBadge(technique.severity)}`}>
                          {technique.severity.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Factual Claims */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#666] mb-3">Factual Claims Verification</h3>
                  <div className="space-y-2">
                    {analysisData.factualClaims.map((claim, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-[#f5f5f5] rounded-lg border border-[#e5e5e5]">
                        <div className="mt-0.5 shrink-0">
                          {claim.status === "true" && <CheckCircle className="size-4 text-green-600" />}
                          {claim.status === "false" && <XCircle className="size-4 text-red-600" />}
                          {claim.status === "unverifiable" && <HelpCircle className="size-4 text-yellow-600" />}
                        </div>
                        <p className="text-sm text-[#1a1a1a] flex-1">{claim.claim}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${
                          claim.status === "true" ? "bg-green-100 text-green-700" :
                          claim.status === "false" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {claim.status === "true" ? "Verified" : claim.status === "false" ? "False" : "Unverifiable"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clean Rewrite */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#666] mb-3 flex items-center gap-2">
                    <FileText className="size-4" />
                    Neutral Rewrite
                  </h3>
                  <div className="p-4 bg-[#f0f7ff] rounded-lg border border-[#d0e3ff]">
                    <p className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">{analysisData.cleanRewrite}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[#e5e5e5] pt-6 mt-8">
                  <div className="flex items-center justify-between text-xs text-[#999]">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="size-4 text-[#22D3EE]" />
                      <span>Generated by VeritasAI</span>
                    </div>
                    <span>This report is for informational purposes only.</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/results">
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Back to Full Results
            </Button>
          </Link>
          <Button 
            onClick={handleDownload}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </main>
  )
}
