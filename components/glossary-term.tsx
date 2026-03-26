"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getGlossaryTerm, getCategoryBadge } from "@/lib/glossary"
import { Info } from "lucide-react"

interface GlossaryTermProps {
  term: string
  children: React.ReactNode
  showIcon?: boolean
}

export function GlossaryTermPopover({ term, children, showIcon = true }: GlossaryTermProps) {
  const glossaryEntry = getGlossaryTerm(term)

  if (!glossaryEntry) {
    return <>{children}</>
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 text-left hover:text-primary transition-colors underline decoration-dotted underline-offset-4 cursor-help">
          {children}
          {showIcon && <Info className="size-3.5 shrink-0 opacity-60" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-card border-border" side="top" align="start">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground">{glossaryEntry.name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded border capitalize shrink-0 ${getCategoryBadge(glossaryEntry.category)}`}>
              {glossaryEntry.category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {glossaryEntry.definition}
          </p>
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Example:</p>
            <p className="text-sm text-foreground/80 italic">
              {glossaryEntry.example}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
