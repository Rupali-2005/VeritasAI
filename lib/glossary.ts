export interface GlossaryTerm {
  name: string
  definition: string
  example: string
  category: "manipulation" | "bias" | "fallacy" | "rhetorical"
}

export const glossary: Record<string, GlossaryTerm> = {
  "Emotional Appeal": {
    name: "Emotional Appeal",
    definition: "A persuasion technique that uses emotions (fear, anger, hope, sympathy) to influence readers rather than relying on facts or logical arguments.",
    example: "\"Think of the children who will suffer if we don't act now!\" — uses sympathy and fear to bypass rational analysis.",
    category: "manipulation"
  },
  "Ad Hominem Attacks": {
    name: "Ad Hominem Attacks",
    definition: "Attacking the character, motive, or personal attributes of a person making an argument rather than addressing the substance of the argument itself.",
    example: "\"We shouldn't listen to her climate policy — she flies on private jets\" — discredits the person instead of their argument.",
    category: "fallacy"
  },
  "False Dichotomy": {
    name: "False Dichotomy",
    definition: "Presenting only two options as if they are the only possibilities when, in reality, more options exist. Also known as the \"either/or\" fallacy.",
    example: "\"You're either with us or against us\" — ignores the possibility of neutral positions or partial agreement.",
    category: "fallacy"
  },
  "Appeal to Authority": {
    name: "Appeal to Authority",
    definition: "Using the opinion or endorsement of an authority figure to support a claim, even when the authority may not be an expert in the relevant field.",
    example: "\"A famous actor says this diet works, so it must be effective\" — celebrity endorsement doesn't equal scientific validity.",
    category: "fallacy"
  },
  "Slippery Slope": {
    name: "Slippery Slope",
    definition: "Arguing that one small step will inevitably lead to extreme, often negative, outcomes without providing evidence for this chain of events.",
    example: "\"If we allow this regulation, soon the government will control everything we do\" — assumes worst-case domino effect.",
    category: "fallacy"
  },
  "Cherry Picking": {
    name: "Cherry Picking",
    definition: "Selecting only the evidence that supports your argument while ignoring contradictory data or context.",
    example: "Citing only studies that support a position while omitting the larger body of research that contradicts it.",
    category: "manipulation"
  },
  "Straw Man": {
    name: "Straw Man",
    definition: "Misrepresenting someone's argument to make it easier to attack, then refuting the distorted version instead of the actual argument.",
    example: "\"Environmentalists want to destroy all industry and send us back to the Stone Age\" — exaggerates the position.",
    category: "fallacy"
  },
  "Bandwagon Effect": {
    name: "Bandwagon Effect",
    definition: "Appealing to popularity or the idea that \"everyone is doing it\" as evidence that something is true or good.",
    example: "\"Millions of people already support this policy, so it must be the right choice\" — popularity doesn't equal correctness.",
    category: "manipulation"
  },
  "Fear Mongering": {
    name: "Fear Mongering",
    definition: "Using exaggerated fears or threats to influence opinions and actions, often without proportionate evidence.",
    example: "\"This policy will lead to economic collapse and mass unemployment\" — uses fear to prevent rational discussion.",
    category: "manipulation"
  },
  "Loaded Language": {
    name: "Loaded Language",
    definition: "Using emotionally charged words to influence the reader's perception, either positively or negatively, beyond what the facts support.",
    example: "\"Freedom fighters\" vs. \"terrorists\" for the same group — word choice shapes perception without changing facts.",
    category: "rhetorical"
  },
  "False Equivalence": {
    name: "False Equivalence",
    definition: "Treating two things as if they are equal when they are fundamentally different, often to give legitimacy to a weaker position.",
    example: "Giving equal time to scientific consensus and fringe theories as if both have equal validity.",
    category: "fallacy"
  },
  "Whataboutism": {
    name: "Whataboutism",
    definition: "Deflecting criticism by pointing to someone else's wrongdoing rather than addressing the original issue.",
    example: "\"Why focus on our pollution when Country X pollutes more?\" — deflects rather than addresses the criticism.",
    category: "rhetorical"
  },
  "Gaslighting": {
    name: "Gaslighting",
    definition: "Manipulating someone into questioning their own perception of reality, often by denying obvious facts or events.",
    example: "\"That never happened\" or \"You're imagining things\" when confronted with documented evidence.",
    category: "manipulation"
  },
  "Appeal to Tradition": {
    name: "Appeal to Tradition",
    definition: "Arguing that something is right or good simply because it has always been done that way.",
    example: "\"We've always done it this way, so there's no reason to change\" — ignores potential improvements.",
    category: "fallacy"
  },
  "Hasty Generalization": {
    name: "Hasty Generalization",
    definition: "Drawing broad conclusions from limited or unrepresentative examples.",
    example: "\"I met two rude people from that city, so everyone there must be rude\" — generalizes from insufficient data.",
    category: "fallacy"
  },
  "Confirmation Bias": {
    name: "Confirmation Bias",
    definition: "The tendency to search for, interpret, and recall information in a way that confirms pre-existing beliefs.",
    example: "Only reading news sources that align with your political views and dismissing contradictory information.",
    category: "bias"
  },
  "Framing": {
    name: "Framing",
    definition: "Presenting information in a way that influences how readers interpret it, through selective emphasis, context, or word choice.",
    example: "\"Tax relief\" vs. \"Tax cuts for the wealthy\" — both describe the same policy but evoke different responses.",
    category: "rhetorical"
  },
  "Omission": {
    name: "Omission",
    definition: "Deliberately leaving out important information that would change the reader's understanding of a story.",
    example: "Reporting on protest violence without mentioning what prompted the protest in the first place.",
    category: "manipulation"
  },
  "Sensationalism": {
    name: "Sensationalism",
    definition: "Exaggerating or dramatizing news to provoke strong emotional reactions and attract attention.",
    example: "Headlines using words like \"SHOCKING,\" \"DEVASTATING,\" or \"EXPLOSIVE\" for routine news stories.",
    category: "rhetorical"
  },
  "False Balance": {
    name: "False Balance",
    definition: "Presenting opposing viewpoints as equally valid even when the evidence heavily supports one side.",
    example: "Giving equal airtime to climate scientists and climate deniers as if their positions have equal merit.",
    category: "bias"
  }
}

export function getGlossaryTerm(name: string): GlossaryTerm | undefined {
  return glossary[name]
}

export function getCategoryColor(category: GlossaryTerm["category"]): string {
  switch (category) {
    case "manipulation":
      return "text-red-400"
    case "bias":
      return "text-yellow-400"
    case "fallacy":
      return "text-orange-400"
    case "rhetorical":
      return "text-blue-400"
    default:
      return "text-muted-foreground"
  }
}

export function getCategoryBadge(category: GlossaryTerm["category"]): string {
  switch (category) {
    case "manipulation":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "bias":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "fallacy":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "rhetorical":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}
