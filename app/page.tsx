"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Scale, FileText } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("paste")
  const [articleText, setArticleText] = useState("")
  const [articleUrl, setArticleUrl] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleAnalyze = () => {
    // Analysis logic would go here
    console.log("Analyzing:", { activeTab, articleText, articleUrl, searchQuery })
  }

  const getButtonDisabled = () => {
    if (activeTab === "paste") return !articleText.trim()
    if (activeTab === "url") return !articleUrl.trim()
    if (activeTab === "search") return !searchQuery.trim()
    return true
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 text-primary">
            <ShieldAlert className="size-8" />
            <span className="text-xl font-semibold tracking-tight">VeritasAI</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Analyze News with Clarity
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Detect bias, manipulation, and hidden narratives in seconds
          </p>
        </header>

        {/* Main Input Section */}
        <section className="mb-20">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-3 bg-muted">
                  <TabsTrigger 
                    value="paste"
                    className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    Paste Article
                  </TabsTrigger>
                  <TabsTrigger 
                    value="url"
                    className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    Enter URL
                  </TabsTrigger>
                  <TabsTrigger 
                    value="search"
                    className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    Search Topic
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="paste" className="mt-0">
                  <Textarea
                    placeholder="Paste your article text here..."
                    value={articleText}
                    onChange={(e) => setArticleText(e.target.value)}
                    className="min-h-[200px] resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </TabsContent>

                <TabsContent value="url" className="mt-0">
                  <Input
                    type="url"
                    placeholder="Enter article URL (e.g., https://example.com/article)"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    className="h-14 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </TabsContent>

                <TabsContent value="search" className="mt-0">
                  <Input
                    type="text"
                    placeholder="Search for a topic (e.g., climate policy, tech regulation)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </TabsContent>

                <Button 
                  onClick={handleAnalyze}
                  disabled={getButtonDisabled()}
                  className="mt-6 h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                  size="lg"
                >
                  Analyze Article
                </Button>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Feature Cards */}
        <section>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<ShieldAlert className="size-6" />}
              title="Detect Manipulation"
              description="Identify misleading claims, logical fallacies, and emotional manipulation tactics used in news coverage."
            />
            <FeatureCard
              icon={<Scale className="size-6" />}
              title="Understand Bias"
              description="Uncover political leaning, framing techniques, and omitted perspectives in any article."
            />
            <FeatureCard
              icon={<FileText className="size-6" />}
              title="Get Neutral Rewrite"
              description="Receive an AI-generated balanced version of the article with objective language."
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <Card className="border-border bg-card transition-colors hover:border-primary/50">
      <CardHeader>
        <div className="mb-2 text-primary">{icon}</div>
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
