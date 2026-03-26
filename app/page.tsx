"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Scale, FileText, Loader2, ArrowRight } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("paste")
  const [articleText, setArticleText] = useState("")
  const [articleUrl, setArticleUrl] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Compare mode states
  const [compareMode, setCompareMode] = useState(false)
  const [article1Type, setArticle1Type] = useState<"paste" | "url">("paste")
  const [article2Type, setArticle2Type] = useState<"paste" | "url">("paste")
  const [article1Text, setArticle1Text] = useState("")
  const [article1Url, setArticle1Url] = useState("")
  const [article2Text, setArticle2Text] = useState("")
  const [article2Url, setArticle2Url] = useState("")

  const handleAnalyze = async () => {
    if (activeTab === "search") {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      return
    }
    
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/results")
  }

  const handleCompare = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2500))
    router.push("/compare")
  }

  const getButtonDisabled = () => {
    if (activeTab === "paste") return !articleText.trim()
    if (activeTab === "url") return !articleUrl.trim()
    if (activeTab === "search") return !searchQuery.trim()
    return true
  }

  const getCompareDisabled = () => {
    const article1Valid = article1Type === "paste" ? article1Text.trim() : article1Url.trim()
    const article2Valid = article2Type === "paste" ? article2Text.trim() : article2Url.trim()
    return !article1Valid || !article2Valid
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

        {/* Mode Toggle */}
        <section className="mb-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setCompareMode(false)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  !compareMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Analyze Article
              </button>
              <button
                onClick={() => setCompareMode(true)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                  compareMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Scale className="size-4" />
                Compare Two Articles
              </button>
            </div>
          </div>
        </section>

        {/* Single Article Analysis Section */}
        {!compareMode && (
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
                    disabled={getButtonDisabled() || isLoading}
                    className="mt-6 h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Analyzing article...
                      </>
                    ) : activeTab === "search" ? (
                      "Search Articles"
                    ) : (
                      "Analyze Article"
                    )}
                  </Button>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Compare Two Articles Section */}
        {compareMode && (
          <section className="mb-20">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Article 1 */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">1</span>
                    Article One
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-2">
                    <button
                      onClick={() => setArticle1Type("paste")}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        article1Type === "paste" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Paste Text
                    </button>
                    <button
                      onClick={() => setArticle1Type("url")}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        article1Type === "url" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Enter URL
                    </button>
                  </div>
                  {article1Type === "paste" ? (
                    <Textarea
                      placeholder="Paste first article text here..."
                      value={article1Text}
                      onChange={(e) => setArticle1Text(e.target.value)}
                      className="min-h-[160px] resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  ) : (
                    <Input
                      type="url"
                      placeholder="Enter article URL..."
                      value={article1Url}
                      onChange={(e) => setArticle1Url(e.target.value)}
                      className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Article 2 */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">2</span>
                    Article Two
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-2">
                    <button
                      onClick={() => setArticle2Type("paste")}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        article2Type === "paste" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Paste Text
                    </button>
                    <button
                      onClick={() => setArticle2Type("url")}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        article2Type === "url" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Enter URL
                    </button>
                  </div>
                  {article2Type === "paste" ? (
                    <Textarea
                      placeholder="Paste second article text here..."
                      value={article2Text}
                      onChange={(e) => setArticle2Text(e.target.value)}
                      className="min-h-[160px] resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  ) : (
                    <Input
                      type="url"
                      placeholder="Enter article URL..."
                      value={article2Url}
                      onChange={(e) => setArticle2Url(e.target.value)}
                      className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Compare Button */}
            <Button 
              onClick={handleCompare}
              disabled={getCompareDisabled() || isLoading}
              className="mt-6 h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Comparing articles...
                </>
              ) : (
                <>
                  Compare Articles
                  <ArrowRight className="ml-2 size-5" />
                </>
              )}
            </Button>
          </section>
        )}

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
