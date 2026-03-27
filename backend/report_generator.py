from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io

# Clean professional colors
BLUE = colors.HexColor("#2563eb")
RED = colors.HexColor("#dc2626")
ORANGE = colors.HexColor("#f59e0b")
GREEN = colors.HexColor("#16a34a")
GREY = colors.HexColor("#6b7280")
MID_GREY = colors.HexColor("#e5e7eb")
BLACK = colors.HexColor("#111827")
WHITE = colors.white

def clean(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\u2018", "'").replace("\u2019", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    text = text.replace("\u2026", "...").replace("\u00a0", " ")
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return text.strip()

def severity_color(score):
    if score >= 7: return RED
    elif score >= 4: return ORANGE
    return GREEN

def manipulation_color(score):
    if score >= 7: return RED
    elif score >= 4: return ORANGE
    return GREEN

def make_styles():
    return {
        "title": ParagraphStyle("title",
            fontSize=24, textColor=BLUE, fontName="Helvetica-Bold",
            alignment=TA_CENTER, spaceAfter=6),
        "subtitle": ParagraphStyle("subtitle",
            fontSize=10, textColor=GREY, fontName="Helvetica",
            alignment=TA_CENTER, spaceAfter=6),
        "report_name": ParagraphStyle("report_name",
            fontSize=9, textColor=GREY, fontName="Helvetica-Oblique",
            alignment=TA_CENTER, spaceAfter=16),
        "section": ParagraphStyle("section",
            fontSize=12, textColor=BLUE, fontName="Helvetica-Bold",
            spaceBefore=14, spaceAfter=6),
        "body": ParagraphStyle("body",
            fontSize=9, textColor=BLACK, fontName="Helvetica",
            leading=13, spaceAfter=5),
        "bold": ParagraphStyle("bold",
            fontSize=10, textColor=BLACK, fontName="Helvetica-Bold",
            spaceAfter=6),
        "quote": ParagraphStyle("quote",
            fontSize=8, textColor=GREY, fontName="Helvetica-Oblique",
            leftIndent=10, spaceAfter=4),
        "footer": ParagraphStyle("footer",
            fontSize=8, textColor=GREY, fontName="Helvetica",
            alignment=TA_CENTER, spaceBefore=12),
    }

def generate_report(analysis: dict, article_title: str = "Analyzed Article", report_name: str = "VeritasAI Report") -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=20*mm, rightMargin=20*mm,
        topMargin=20*mm, bottomMargin=20*mm
    )

    s = make_styles()
    story = []

    # Header
    story.append(Paragraph("VeritasAI", s["title"]))
    story.append(Paragraph("Media Bias &amp; Manipulation Analysis Report", s["subtitle"]))
    story.append(Paragraph(clean(report_name), s["report_name"]))
    story.append(HRFlowable(width="100%", thickness=1.5, color=BLUE, spaceAfter=12))
    story.append(Paragraph(clean(article_title), s["bold"]))
    story.append(Spacer(1, 6))

    # Manipulation Score
    score = analysis.get("overall_manipulation_score", 0)
    score_color = manipulation_color(score)
    score_label = (
        "Low Manipulation - Mostly clean writing."
        if score <= 3 else
        "Moderate Manipulation - Read critically."
        if score <= 6 else
        "High Manipulation - Be very skeptical."
    )

    story.append(Paragraph("Manipulation Score", s["section"]))
    story.append(Paragraph(f'<font color="{score_color.hexval()}" size="18"><b>{score:.1f}/10</b></font>',
        ParagraphStyle("score_display", fontSize=18, alignment=TA_LEFT, spaceAfter=4)))
    story.append(Paragraph(score_label, s["body"]))
    story.append(Spacer(1, 4))

    # Political Leaning
    leaning = analysis.get("political_leaning", {})
    if leaning:
        story.append(Paragraph("Political Leaning", s["section"]))
        story.append(Paragraph(f'<b>{clean(leaning.get("label", "Unknown"))}</b>', s["body"]))
        signals = ", ".join([clean(sig) for sig in leaning.get("key_signals", [])])
        story.append(Paragraph(f'Confidence: {leaning.get("confidence", 0)}%', s["body"]))
        if signals:
            story.append(Paragraph(f'Key signals: {clean(signals)}', s["body"]))
        story.append(Spacer(1, 4))

    # Rhetorical Summary
    story.append(Paragraph("What This Article Is Doing", s["section"]))
    story.append(Paragraph(clean(analysis.get("rhetorical_summary", "N/A")), s["body"]))
    story.append(Spacer(1, 4))

    # Detected Patterns
    patterns = analysis.get("detected_patterns", [])
    if patterns:
        story.append(Paragraph(f"Detected Manipulation Patterns ({len(patterns)} found)", s["section"]))

        for p in patterns:
            sev = p.get("severity", 0)
            sev_color = severity_color(sev)

            pattern_data = [
                [Paragraph(clean(f"<b>{p.get('category')} - {p.get('subcategory')}</b>"), s["body"]),
                 Paragraph(f'<font color="{sev_color.hexval()}"><b>Severity: {sev}/10</b></font>',
                    ParagraphStyle("sev", fontSize=9, alignment=TA_LEFT))],
            ]

            pattern_table = Table(pattern_data, colWidths=[120*mm, 40*mm])
            pattern_table.setStyle(TableStyle([
                ("BOX", (0, 0), (-1, -1), 0.5, MID_GREY),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("PADDING", (0, 0), (-1, -1), 6),
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
            ]))
            story.append(pattern_table)

            if p.get("quote"):
                story.append(Paragraph(clean(f'"{p.get("quote", "")}"'), s["quote"]))
            story.append(Paragraph(f'<b>What this is:</b> {clean(p.get("what_this_means", ""))}', s["body"]))
            story.append(Paragraph(f'<b>Why it\'s problematic:</b> {clean(p.get("why_its_problematic", ""))}', s["body"]))
            story.append(Spacer(1, 6))

    # Factual Claims
    claims = analysis.get("factual_claims", [])
    if claims:
        story.append(Paragraph(f"Factual Claims ({len(claims)} extracted)", s["section"]))
        for c in claims:
            verdict = c.get("verdict", "Unverifiable")
            if "True" in verdict: v_color = GREEN
            elif "False" in verdict: v_color = RED
            else: v_color = GREY

            claim_table = Table(
                [[
                    Paragraph(clean(c.get("claim", "")), s["body"]),
                    Paragraph(f'<font color="{v_color.hexval()}"><b>{clean(verdict)}</b></font>',
                        ParagraphStyle("cv", fontSize=8, alignment=TA_LEFT))
                ]],
                colWidths=[120*mm, 40*mm]
            )
            claim_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.5, MID_GREY),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]))
            story.append(claim_table)
            story.append(Spacer(1, 3))

    # Clean Rewrite
    story.append(Paragraph("Clean Rewrite", s["section"]))
    story.append(Paragraph(clean(analysis.get("clean_rewrite", "N/A")), s["body"]))

    # Footer
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=0.5, color=MID_GREY))
    story.append(Paragraph(
        "Generated by VeritasAI - AI-powered Media Bias and Manipulation Detector",
        s["footer"]
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
